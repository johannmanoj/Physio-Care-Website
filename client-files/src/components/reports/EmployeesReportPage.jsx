import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';

const API_URL = import.meta.env.VITE_API_URL;

function EmployeesReportPage({ pageName, viewfunction, setSelectedUserId }) {
    const { branchId } = useAuth();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const statuses = ['Admin', 'Trainer', 'Therapist', 'Receptionist'];

    useEffect(() => {
        fetchUsers();
    }, [branchId, searchTerm, filterStatus, currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/users/get-all-users-list`, {
                branch_id: branchId,
                search: searchTerm,
                role: filterStatus,
                page: currentPage,
                limit: usersPerPage,
            });
            setUsers(response.data.data);
            setTotalUsers(response.data.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfFirstUser = (currentPage - 1) * usersPerPage;
    const indexOfLastUser = indexOfFirstUser + users.length;
    const page_count = `Showing ${indexOfFirstUser + 1} to ${indexOfLastUser} of ${totalUsers}`;

    // if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className="common-page-header">
                <h1>Employees</h1>
                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setFilterStatus(e.target.value);
                        }}
                    >
                        <option value="">All Roles</option>
                        {statuses.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search Name or Email..."
                            value={searchTerm}
                            className="search-input"
                            onChange={(e) => {
                                setCurrentPage(1);
                                setSearchTerm(e.target.value);
                            }}
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
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td className='commn-table-action-td'>
                                    <div className='common-table-action-btn-layout'>
                                        <FaEye
                                            className='common-table-action-btn'
                                            onClick={() => viewfunction(user)}
                                        />
                                    </div>
                                </td>
                                {/* <td>
                                    <button
                                        className="primary-button"
                                        onClick={() => viewfunction(user)}
                                    >
                                        View
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className='appointments-default-message'>
                    <FaUsers className='appointments-default-logo' />
                    <div className='appointments-default-text'>No Users Yet</div>
                </div>
            )}

            <div className="table-footer">
                <PaginationFooter
                    page_count={page_count}
                    playersPerPage={usersPerPage}
                    totalPlayers={totalUsers}
                    paginate={paginate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default EmployeesReportPage;
