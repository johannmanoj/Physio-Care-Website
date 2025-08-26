import Select from "react-select";
import { useState, useEffect } from "react";
import axios from 'axios';
import './AddAppointment.css';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AddAppointment() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [employees, setEmployees] = useState()
    const [filteredPatients, setFilteredPatients] = useState([]); // 🔥 filtered list
    const [searchPhone, setSearchPhone] = useState(""); // 🔥 phone search input
    const [newAppointment, setNewAppointment] = useState({
        practitioner: '', patient_id: '', name: '', sex: '', age: '', contact_num: '', date: '', time: '', session_typ: ''
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', sex: '', age: '', contact_num: '' });

    const timeOptions = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let min of [0, 30]) {
            if (hour === 18 && min > 0) break;
            const h = hour % 12 || 12;
            const ampm = hour < 12 ? "AM" : "PM";
            const label = `${h}:${min === 0 ? "00" : "30"} ${ampm}`;
            timeOptions.push({ value: label, label });
        }
    }

    const fetchPatients = () => {
        axios.post(`${API_URL}/api/patients/get-patient-list`)
            .then((response) => {
                setPatients(response.data.data);
                setFilteredPatients(response.data.data); // initially full list
            })
            .catch((error) => {
                console.error('Error fetching patients data:', error);
            });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // 🔥 Filter patients by phone input
    useEffect(() => {
        if (!searchPhone.trim()) {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(p =>
                p.contact_num?.toString().includes(searchPhone.trim())
            );
            setFilteredPatients(filtered);
        }
    }, [searchPhone, patients]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = (role) => {
        axios.post(`${API_URL}/api/users/get-custom-users-list`, { role })
            .then((response) => {
                setEmployees(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching players data:', error);
            });
    };

    const handleSessionChange = (e) => {
        const selectedSession = e.target.value;

        setNewAppointment({ ...newAppointment, session_typ: selectedSession });

        // pass it directly here
        fetchUsers(selectedSession);
    };






    const handleAddPatient = () => {
        axios.post(`${API_URL}/api/patients/add-new-patient`, newPatient)
            .then(() => {
                setShowAddModal(false);
                setNewPatient({ name: '', sex: '', age: '', contact_num: '' });
                fetchPatients(); // refresh list
            })
            .catch((error) => {
                console.error('Error adding patient:', error);
            });
    };

    const handleAddAppointment = () => {
        axios.post(`${API_URL}/api/appointments/add-new-appointment`, newAppointment)
            .then(() => {
                setNewAppointment({ practitioner: '', patient_id: '', name: '', sex: '', age: '', contact_num: '', date: '', time: '', session_typ: '' });
                navigate("/appointments");
            })
            .catch((error) => {
                console.error('Error adding appointment:', error);
            });
    };

    return (
        <div className="profile-page">
            <div className="create-appointment-header">
                <h1>Create Appointment</h1>
                <button className="add-patient-button" onClick={() => setShowAddModal(true)}>Add Patient</button>
            </div>

            {/* 🔍 Search by Phone */}
            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label>Search Patient by Phone</label>
                    <Select
                        options={filteredPatients.map((p) => ({
                            value: p.id,
                            label: p.patient_name,
                            phone: p.contact_num,
                            data: p,
                        }))}
                        className="patient-select"
                        classNamePrefix="rs"
                        placeholder="Enter phone number"
                        menuPlacement="bottom"
                        isClearable
                        value={
                            newAppointment.patient_id
                                ? {
                                    value: newAppointment.patient_id,
                                    label: newAppointment.name,
                                    phone: newAppointment.contact_num,
                                    data: newAppointment,
                                }
                                : null
                        }
                        onInputChange={(inputValue, { action }) => {
                            if (action === "input-change") setSearchPhone(inputValue);
                        }}
                        filterOption={() => true} // 👈 disable default filtering
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                const p = selectedOption.data;
                                setNewAppointment({
                                    ...newAppointment,
                                    patient_id: p.id,
                                    name: p.patient_name,
                                    sex: p.sex,
                                    age: p.age,
                                    contact_num: p.contact_num,
                                });
                                setSearchPhone(p.contact_num);
                            } else {
                                setNewAppointment({
                                    practitioner: '',
                                    patient_id: '',
                                    name: '',
                                    sex: '',
                                    age: '',
                                    contact_num: '',
                                    date: '',
                                    time: '',
                                    session_typ: '',
                                });
                                setSearchPhone("");
                            }
                        }}
                        formatOptionLabel={(option, { context }) =>
                            context === "menu"
                                ? `${option.label} - ${option.phone}` // menu → phone + name
                                : option.label // selected → only name
                        }
                        styles={{
                            input: (base) => ({ ...base, color: "white" }),
                            singleValue: (base) => ({ ...base, color: "white" }),
                            menuList: (base) => ({ ...base, maxHeight: "180px", overflowY: "auto" }),
                        }}
                    />

                </div>
                <div className="data-field data-field-2">
                    <label>Phone</label>
                    <input
                        type="text"
                        placeholder="Phone number"
                        value={newAppointment.contact_num}
                        readOnly
                    />
                </div>
            </div>




            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label>Session Type</label>
                    <select
                        id="session_typ"
                        // value={patientData.sex ?? ''}
                        onChange={handleSessionChange}
                    >
                        <option value="">Session Type</option>
                        <option value="Therapist">Therapist</option>
                        <option value="Trainer">Trainer</option>
                    </select>
                    {/* <input
                        type="text"
                        onChange={(e) => setNewAppointment({ ...newAppointment, session_typ: e.target.value })}
                    /> */}
                </div>
                <div className="data-field data-field-2">
                    <label>Practitioner</label>
                    <Select
                        options={employees?.map(emp => ({
                            value: emp.id,
                            label: emp.name, // UI still shows name
                            data: emp,
                        })) || []}
                        className="employee-select"
                        classNamePrefix="rs"
                        placeholder="Select Practitioner"
                        isClearable
                        value={
                            newAppointment.practitioner
                                ? {
                                    value: newAppointment.practitioner,
                                    label: employees?.find(e => e.id === newAppointment.practitioner)?.name || ""
                                }
                                : null
                        }
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                setNewAppointment({
                                    ...newAppointment,
                                    practitioner: selectedOption.value, // ✅ store only therapist ID
                                });
                            } else {
                                setNewAppointment({
                                    ...newAppointment,
                                    practitioner: '', // reset if cleared
                                });
                            }
                        }}
                        styles={{
                            input: (base) => ({ ...base, color: "white" }),
                            singleValue: (base) => ({ ...base, color: "white" }),
                            menuList: (base) => ({ ...base, maxHeight: "180px", overflowY: "auto" }),
                        }}
                    />
                </div>


            </div>
            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label>Date</label>
                    <input
                        type="date"
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="data-field data-field-2">
                    <label>Time</label>
                    <Select
                        options={timeOptions}
                        onChange={(selectedOption) =>
                            setNewAppointment({ ...newAppointment, time: selectedOption.value })}
                        className="time-select"
                        classNamePrefix="rs"
                        menuPlacement="bottom"
                        styles={{
                            menuList: (base) => ({
                                ...base,
                                maxHeight: "180px",
                                overflowY: "auto",
                            }),
                        }}
                    />
                </div>


            </div>

            <div className="profile-save">
                <button onClick={handleAddAppointment}>Create</button>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Patient</h2>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        />
                        <label>Sex</label>

                        {/* <input
                            type="text"
                            placeholder="Sex"
                            onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                        /> */}

                        <select
                            id="sex"
                            // value={patientData.sex ?? ''}
                            onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>




                        <label>Age</label>
                        <input
                            type="number"
                            placeholder="Age"
                            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                        />
                        <label>Contact Number</label>
                        <input
                            type="text"
                            placeholder="Contact Number"
                            onChange={(e) => setNewPatient({ ...newPatient, contact_num: e.target.value })}
                        />

                        <div className="modal-buttons">
                            <button className="view-button" onClick={handleAddPatient}>Add</button>
                            <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAppointment;
