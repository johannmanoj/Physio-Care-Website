import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import Pagination from '../common/Pagination';
import PaginationFooter from '../common/PaginationFooter';


const API_URL = import.meta.env.VITE_API_URL

function EmployeesReportPage({ pageName, viewfunction, setSelectedUserId }) {
    const { branchId } = useAuth();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const statuses = ['Admin', 'Trainer', 'Therapist', 'Receptionist'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.post(`${API_URL}/api/users/get-users-list`, {
            branch_id: branchId
        })
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

    var page_count = `Showing ${indexOfFirstUser + 1} to ${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length}`


    if (loading) { return <p></p>; }
    return (
        <div>
            <div className="common-page-header">
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

            <div className="common-table-wrapper">
                <table className="common-table">
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
                                        className="primary-button"
                                        onClick={() => { viewfunction(user) }}
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
                {/* <span className="pagination-info">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                </span>
                <Pagination
                    playersPerPage={usersPerPage}
                    totalPlayers={filteredUsers.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                /> */}
                <PaginationFooter
                    page_count={page_count}
                    playersPerPage={usersPerPage}
                    totalPlayers={filteredUsers.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default EmployeesReportPage;
