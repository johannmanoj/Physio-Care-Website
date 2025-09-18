import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import axios from 'axios';
import './InvoiceReportPage.css';
import { useNavigate } from "react-router-dom";
import { FaUsers } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL

function InvoiceReportPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const statuses = ['Admin', 'Trainer', 'Therapist', 'Patient', 'Receptionist'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.post(`${API_URL}/api/users/get-users-list`)
            .then((response) => {
                setUsers(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            })
            .finally(() => {
                setLoading(false); // ✅ stop loading after request finishes
            });
    };

    function calculateHoursWorked(attendance) {
        if (!attendance) return { daily: {}, monthlyTotal: 0 };

        const daily = {};
        let monthlyTotal = 0;

        Object.entries(attendance).forEach(([date, { in: inTime, out: outTime }]) => {
            if (inTime && outTime) {
                const start = new Date(inTime);
                const end = new Date(outTime);
                const hours = (end - start) / (1000 * 60 * 60);
                daily[date] = hours.toFixed(2);
                monthlyTotal += hours;
            }
        });

        return { daily, monthlyTotal: monthlyTotal.toFixed(2) };
    }

    function calculateFilteredAttendance(attendance, year, month) {
        if (!attendance) return { daily: {}, monthlyTotal: 0 };

        const daily = {};
        let monthlyTotal = 0;

        Object.entries(attendance).forEach(([date, { in: inTime, out: outTime }]) => {
            if (inTime && outTime) {
                const dateObj = new Date(inTime);
                const dYear = dateObj.getUTCFullYear().toString();
                const dMonth = String(dateObj.getUTCMonth() + 1).padStart(2, "0");

                if (dYear === year && dMonth === month) {
                    const start = new Date(inTime);
                    const end = new Date(outTime);
                    const hours = (end - start) / (1000 * 60 * 60);
                    daily[date] = hours.toFixed(2);
                    monthlyTotal += hours;
                }
            }
        });

        return { daily, monthlyTotal: monthlyTotal.toFixed(2) };
    }

    function InvoiceTable({ practitionerId, year, month }) {
        const [invoices, setInvoices] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!practitionerId) return;

            const fetchInvoices = async () => {
                try {
                    const response = await axios.post(`${API_URL}/api/invoice/get-invoice-list`, {
                        filter: "practitioner",
                        practitioner_id: practitionerId,
                    });

                    const allInvoices = response.data.data || response.data.invoices || [];

                    // ✅ Filter locally by year & month
                    const filteredInvoices = allInvoices.filter((inv) => {
                        const rawDate = inv.created || inv.created_at || inv.invoice_date;
                        if (!rawDate) return false;

                        const invDate = new Date(rawDate);
                        const invYear = invDate.getUTCFullYear().toString();
                        const invMonth = String(invDate.getUTCMonth() + 1).padStart(2, "0");

                        return invYear === year && invMonth === month;
                    });

                    setInvoices(filteredInvoices);
                } catch (error) {
                    console.error("Error fetching invoices:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchInvoices();
        }, [practitionerId, year, month]);

        if (loading) return <p>Loading invoices...</p>;
        if (invoices.length === 0) return <p className="text-gray-400 italic">No invoices found for this month</p>;

        // ✅ Calculate total sum of invoices
        const totalSum = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);

        return (
            <div>
                {/* Monthly Total Display */}
                <div className="monthly-total">
                    <strong>Monthly Total:</strong> {totalSum.toFixed(2)}
                </div>

                {/* Invoice Table */}
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Total</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.total}</td>
                                <td>
                                    {inv.invoice_url || inv.url ? (
                                        <a
                                            href={
                                                (inv.invoice_url || inv.url).startsWith("http")
                                                    ? inv.invoice_url || inv.url
                                                    : `https://${inv.invoice_url || inv.url}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-link"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic">No Link</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }





    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? user.role === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    if (loading) { return <p></p>; }
    return (
        <div className="patients-page-container">
            <div className="page-header">
                <h1>Employees</h1>
                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        {statuses.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search Name here..."
                            value={searchTerm}
                            className='search-input'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="view-button"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowRevenueModal(true);
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length == 0 && (
                <div className='appointments-default-message'>
                    <FaUsers className='appointments-default-logo' />
                    <div className='appointments-default-text'>No Users Yet</div>
                </div>
            )}

            <div className="table-footer">
                <span className="pagination-info">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                </span>
                <Pagination
                    playersPerPage={usersPerPage}
                    totalPlayers={filteredUsers.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>

            {showRevenueModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        {/* Header */}
                        <h2 className="modal-header">{selectedUser.name} - Invoice Report</h2>

                        {/* Year & Month Selection */}
                        <div className="filter-row">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Select Year</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>

                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Select Month</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>

                        {/* Invoice List */}
                        <div className="invoice-list">
                            {selectedYear && selectedMonth ? (
                                <InvoiceTable
                                    practitionerId={selectedUser.id}
                                    year={selectedYear}
                                    month={selectedMonth}
                                />
                            ) : (
                                <p className="text-gray-400 italic">Please select Year and Month</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                className="close-btn"
                                onClick={() => setShowRevenueModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
}

export default InvoiceReportPage;
