import { React, useEffect, useState } from 'react';
import axios from 'axios'
import { Toaster, toast } from "react-hot-toast";
import { useParams } from 'react-router-dom';
import './UserPage.css'

const API_URL = import.meta.env.VITE_API_URL

const INITIAL_DATA = {
    id: '',
    email: '',
    password: '',
    role: '',
    created: '',
    name: '',
    phone: '',
    dob: '',
    joining_date: '',
    leaving_date: '',
    monthly_salary: '',
    pf: '',
    tax: '',
    bank_name: '',
    acc_holder_name: '',
    acc_number: '',
    ifsc_code: '',
    attendance: '',
    monthly_working_days: ''
};

const UserPage = () => {
    const { employeeId } = useParams();
    const user_roles = ['Admin', 'Trainer', 'Therapist', 'Patient', 'Receptionist'];
    const [employeeData, setEmployeeData] = useState(INITIAL_DATA);

    const [salaryYear, setSalaryYear] = useState("");
    const [salaryMonth, setSalaryMonth] = useState("");
    const [workingDays, setWorkingDays] = useState(null);
    const [showCalculateModal, setShowCalculateModal] = useState(false);


    useEffect(() => {
        axios.post(`${API_URL}/api/users/get-user-details`, { "user_id": employeeId })
            .then((response) => {
                if (response.data.data.length > 0) {
                    setEmployeeData(response.data.data[0])
                }
            })
            .catch((error) => {
                console.error('Error fetching players data:', error);
            });
    }, []);

    const updateEmployeeData = (newData) => {
        setEmployeeData(prev => ({ ...prev, ...newData }));
    };

    const handleSave = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/users/update-user`, employeeData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error('Error updating Profile:', err);
            toast.error("Something went wrong!");
        }
    };

    const monthMap = {
        January: "jan",
        February: "feb",
        March: "mar",
        April: "apr",
        May: "may",
        June: "jun",
        July: "jul",
        August: "aug",
        September: "sep",
        October: "oct",
        November: "nov",
        December: "dec"
    };

    const handleCalculateWorkingDays = (year, month) => {
        if (!year || !month) {
            toast.error("Please select salary year and month");
            return;
        }

        let attendance = employeeData.attendance;
        if (typeof attendance === "string") {
            try {
                attendance = JSON.parse(attendance);
            } catch (err) {
                console.error("Invalid attendance JSON:", err);
                toast.error("Invalid attendance data");
                return;
            }
        }

        const monthNum = new Date(`${month} 1, ${year}`).getMonth(); // 0-11
        let days = 0;

        Object.keys(attendance || {}).forEach(dateStr => {
            const d = new Date(dateStr);
            if (d.getFullYear() === parseInt(year) && d.getMonth() === monthNum) {
                if (attendance[dateStr].in) {
                    days++;
                }
            }
        });

        // Set editable value in input
        setWorkingDays(days);

        // Also update employeeData.monthly_working_days
        const monthMap = {
            January: "jan", February: "feb", March: "mar", April: "apr",
            May: "may", June: "jun", July: "jul", August: "aug",
            September: "sep", October: "oct", November: "nov", December: "dec"
        };
        const monthKey = monthMap[month];

        const updatedMonthlyDays = {
            ...(employeeData.monthly_working_days || {}),
            [year]: {
                ...(employeeData.monthly_working_days?.[year] || {}),
                [monthKey]: days
            }
        };

        setEmployeeData(prev => ({
            ...prev,
            monthly_working_days: updatedMonthlyDays
        }));

        toast.success(`Working days for ${month} ${year}: ${days}`);
    };

    const handleUpdateWorkingDays = async () => {
        try {
            if (!employeeData.id) {
                toast.error("Employee ID missing!");
                return;
            }

            await axios.post(`${API_URL}/api/users/update-user-working-days`, {
                id: employeeData.id,
                monthly_working_days: JSON.stringify(employeeData.monthly_working_days)
            });

            toast.success("Working days updated successfully!");
        } catch (err) {
            console.error("Error updating working days:", err);
            toast.error("Failed to update working days");
        }
    };

    const handleWorkingDaysChange = (e) => {
        const newDays = e.target.value;
        setWorkingDays(newDays);

        const monthMap = {
            January: "jan", February: "feb", March: "mar", April: "apr",
            May: "may", June: "jun", July: "jul", August: "aug",
            September: "sep", October: "oct", November: "nov", December: "dec"
        };
        const monthKey = monthMap[salaryMonth];
        const year = salaryYear;

        if (year && monthKey) {
            setEmployeeData(prev => ({
                ...prev,
                monthly_working_days: {
                    ...(prev.monthly_working_days || {}),
                    [year]: {
                        ...(prev.monthly_working_days?.[year] || {}),
                        [monthKey]: newDays   // 🔥 keep in sync
                    }
                }
            }));
        }
    };



    return (
        <div className="user-page-container">
            <div className='user-page-header'>
                <h1>Employee Details</h1>
            </div>

            <div className='data-field-row'>
                <div className='data-field data-field-2'>
                    <label>Employee ID</label>
                    <input
                        name="id"
                        value={employeeData.id ?? ''}
                        onChange={(e) => updateEmployeeData({ id: e.target.value })}
                        readOnly
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>Name</label>
                    <input
                        name="name"
                        value={employeeData.name ?? ''}
                        onChange={(e) => updateEmployeeData({ name: e.target.value })}
                        placeholder="Name"
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label htmlFor="Role">Role</label>
                    <select
                        value={employeeData.role}
                        onChange={(e) => updateEmployeeData({ role: e.target.value })}
                    >
                        <option value="">Select Role</option>
                        {user_roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

            </div>

            <div className='data-field-row'>
                <div className='data-field data-field-2'>
                    <label>Email</label>
                    <input
                        name="email"
                        value={employeeData.email ?? ''}
                        onChange={(e) => updateEmployeeData({ email: e.target.value })}
                        placeholder="Email"
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={employeeData.phone ?? ''}
                        onChange={(e) => updateEmployeeData({ phone: e.target.value })}
                        placeholder="Phone"
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>DOB</label>
                    <input
                        type="date"
                        value={employeeData.dob ?? ''}
                        onChange={(e) => updateEmployeeData({ dob: e.target.value })}
                    />
                </div>
            </div>

            <div className='data-field-row'>
                <div className='data-field data-field-2'>
                    <label>Joining Date</label>
                    <input
                        type="date"
                        value={employeeData.joining_date ?? ''}
                        onChange={(e) => updateEmployeeData({ joining_date: e.target.value })}
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>Leaving Date</label>
                    <input
                        type="date"
                        value={employeeData.leaving_date ?? ''}
                        onChange={(e) => updateEmployeeData({ leaving_date: e.target.value })}
                    />
                </div>
            </div>


            <div className='user-page-sub-heading'>Salary Processing</div>

            <div className='data-field-row'>
                <div className='data-field data-field-3'>
                    <label>Monthly Salary</label>
                    <input
                        name="monthly_salary"
                        value={employeeData.monthly_salary ?? ''}
                        onChange={(e) => updateEmployeeData({ monthly_salary: e.target.value })}
                        placeholder="Monthly Salary"
                    />
                </div>
                <div className='data-field data-field-3'>
                    <label>PF</label>
                    <input
                        name="pf"
                        value={employeeData.pf ?? ''}
                        onChange={(e) => updateEmployeeData({ pf: e.target.value })}
                        placeholder="PF"
                    />
                </div>
                <div className='data-field data-field-3'>
                    <label>Tax</label>
                    <input
                        name="tax"
                        value={employeeData.tax ?? ''}
                        onChange={(e) => updateEmployeeData({ tax: e.target.value })}
                        placeholder="Tax"
                    />
                </div>
            </div>

            <div className='data-field-row'>
                <div className='data-field data-field-3'>
                    <label>Working Year</label>
                    <input
                        type="number"
                        placeholder="YYYY"
                        value={salaryYear}
                        onChange={(e) => setSalaryYear(e.target.value)}
                    />
                </div>
                <div className='data-field data-field-3'>
                    <label htmlFor="month-select">Working Month</label>
                    <select
                        id="month-select"
                        value={salaryMonth}
                        onChange={(e) => setSalaryMonth(e.target.value)}
                    >
                        <option value="">Select a month</option>
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className='data-field data-field-3'>
                    <button
                        className='salary-calculate-button'
                        onClick={() => handleCalculateWorkingDays(salaryYear, salaryMonth)}
                    // onClick={() => setShowCalculateModal(true)}
                    >
                        Calculate
                    </button>
                </div>

            </div>
            {workingDays !== null && (
                <div className='data-field-row'>
                    <div className='data-field data-field-3'>
                        <label>Working Days</label>
                        <input
                            type="number"
                            value={workingDays}
                            onChange={handleWorkingDaysChange}
                            placeholder="Working Days"
                        />
                    </div>

                    <div className='data-field data-field-3'>
                        <button
                            className="salary-calculate-button"
                            onClick={handleUpdateWorkingDays}
                        >
                            Update
                        </button>
                    </div>
                </div>


            )}




            <div className='user-page-sub-heading'>Bank Details</div>
            <div className='data-field-row'>
                <div className='data-field data-field-4'>
                    <label>Bank Name</label>
                    <input
                        name="bank_name"
                        value={employeeData.bank_name ?? ''}
                        onChange={(e) => updateEmployeeData({ bank_name: e.target.value })}
                        placeholder="Bank Name"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>Account Holder Name</label>
                    <input
                        name="acc_holder_name"
                        value={employeeData.acc_holder_name ?? ''}
                        onChange={(e) => updateEmployeeData({ acc_holder_name: e.target.value })}
                        placeholder="Account Holder Name"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>Account Number</label>
                    <input
                        name="acc_number"
                        value={employeeData.acc_number ?? ''}
                        onChange={(e) => updateEmployeeData({ acc_number: e.target.value })}
                        placeholder="Account Number"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>IFSC Code</label>
                    <input
                        name="ifsc_code"
                        value={employeeData.ifsc_code ?? ''}
                        onChange={(e) => updateEmployeeData({ ifsc_code: e.target.value })}
                        placeholder="IFSC Code"
                    />
                </div>
            </div>

            <div className='profile-save'>
                <button onClick={handleSave}>Save</button>
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e293b",
                        color: "#f8fafc",
                        border: "1px solid #334155",
                    },
                    success: {
                        iconTheme: {
                            primary: "#22c55e",
                            secondary: "#1e293b",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#1e293b",
                        },
                    },
                }}
            />

            {/* {showCalculateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Monthly Working Days</h2>
                        

                    </div>
                </div>
            )} */}
        </div>
    )
}

export default UserPage