import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import axios from 'axios';
import './AttendanceReportPage.css';
import { useNavigate } from "react-router-dom";
import { FaUsers } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL

function AttendanceReportPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
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
                                            setShowAttendanceModal(true);
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

            {showAttendanceModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        {/* Header */}
                        <h2 className="modal-header">Attendance - {selectedUser.name}</h2>

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
                                <option value="2024">2023</option>
                                <option value="2024">2022</option>
                                <option value="2024">2021</option>
                                <option value="2024">2020</option>
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

                        {/* Attendance List */}
                        <div className="attendance-list">
                            {selectedYear && selectedMonth ? (
                                (() => {
                                    const { daily, monthlyTotal } = calculateFilteredAttendance(
                                        selectedUser.attendance,
                                        selectedYear,
                                        selectedMonth
                                    );

                                    return (
                                        <>
                                            {Object.entries(daily).length > 0 ? (
                                                Object.entries(daily).map(([date, hours]) => (
                                                    <div className="attendance-item" key={date}>
                                                        <span>{date}</span>
                                                        <span className="attendance-hours">{hours} hrs</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic">No attendance for this month</p>
                                            )}
                                            <p className="monthly-total">Monthly Total: {monthlyTotal} hrs</p>
                                        </>
                                    );
                                })()
                            ) : (
                                <p className="text-gray-400 italic">Please select Year and Month</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                className="close-btn"
                                onClick={() => setShowAttendanceModal(false)}
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

export default AttendanceReportPage;
