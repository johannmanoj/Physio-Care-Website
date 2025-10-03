import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import Pagination from '../common/Pagination';

const API_URL = import.meta.env.VITE_API_URL

const INITIAL_USER_DATA = {
    id: '',
    name: '',
    address_line_1: '',
    address_line_2: '',
    address_line_3: '',
    phone_1: '',
    phone_2: '',
}

function UsersProfile() {
    const navigate = useNavigate();
    const { branchId } = useAuth();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState(INITIAL_USER_DATA);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(INITIAL_USER_DATA);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.post(`${API_URL}/api/branches/get-branches-list`, {
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

    const handleAddUser = () => {
        const { name, address_line_1, address_line_2, address_line_3, phone_1, phone_2 } = newUser;

        // ✅ Validation check
        if (!name || !address_line_1 || !address_line_2 || !address_line_3 || !phone_1 || !phone_2) {
            toast.error("Please fill all fields before saving user.");
            return;
        }

        axios.post(`${API_URL}/api/branches/add-new-branch`, newUser)
            .then(() => {
                toast.success("User added successfully!");
                setShowAddModal(false);
                setNewUser(INITIAL_USER_DATA);
                fetchUsers();
            })
            .catch((error) => {
                toast.error("Failed to add user. Try again.");
                console.error('Error adding user:', error);
            });
    };


    const handleEditUser = () => {
        axios.post(`${API_URL}/api/branches/update-branch`, editUser)
            .then(() => {
                setShowEditModal(false);
                setEditUser(INITIAL_USER_DATA);
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };

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
                <h1>Branches</h1>
                <div className="filters">
                    <button className='view-button' onClick={() => setShowAddModal(true)}>Add Branch</button>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search Branch Name here..."
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
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address Line 1</th>
                            <th>Address Line 2</th>
                            <th>Address Line 3</th>
                            <th>Phone 1</th>
                            <th>Phone 2</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.name}</td>
                                <td>{appointment.address_line_1}</td>
                                <td>{appointment.address_line_2}</td>
                                <td>{appointment.address_line_3}</td>
                                <td>{appointment.phone_1}</td>
                                <td>{appointment.phone_1}</td>
                                <td>
                                    <button
                                        className="view-button"
                                        onClick={() => {
                                            setEditUser(
                                                {
                                                    id: appointment.id,
                                                    name: appointment.name,
                                                    address_line_1: appointment.address_line_1,
                                                    address_line_2: appointment.address_line_2,
                                                    address_line_3: appointment.address_line_3,
                                                    phone_1: appointment.phone_1,
                                                    phone_2: appointment.phone_2,
                                                });
                                            setShowEditModal(true);
                                        }}
                                    // onClick={() => navigate(`/userPage/${user.id}`)}
                                    >
                                        Edit
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

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Branch</h2>
                        <label htmlFor="Name">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 1</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.address_line_1}
                            onChange={(e) => setNewUser({ ...newUser, address_line_1: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 2</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.address_line_2}
                            onChange={(e) => setNewUser({ ...newUser, address_line_2: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 3</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.address_line_3}
                            onChange={(e) => setNewUser({ ...newUser, address_line_3: e.target.value })}
                        />
                        <label htmlFor="Email">Phone 1</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.phone_1}
                            onChange={(e) => setNewUser({ ...newUser, phone_1: e.target.value })}
                        />
                        <label htmlFor="Email">Phone 2</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.phone_2}
                            onChange={(e) => setNewUser({ ...newUser, phone_2: e.target.value })}
                        />


                        <div className="modal-buttons">
                            <button className="view-button" onClick={handleAddUser}>Save</button>
                            <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Branch</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editUser.name}
                            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 1</label>
                        <input
                            type="text"
                            placeholder="Email"
                            value={editUser.address_line_1}
                            onChange={(e) => setEditUser({ ...editUser, address_line_1: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 2</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editUser.address_line_2}
                            onChange={(e) => setEditUser({ ...editUser, address_line_2: e.target.value })}
                        />
                        <label htmlFor="Email">Address Line 3</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editUser.address_line_3}
                            onChange={(e) => setEditUser({ ...editUser, address_line_3: e.target.value })}
                        />
                        <label htmlFor="Email">Phone 1</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editUser.phone_1}
                            onChange={(e) => setEditUser({ ...editUser, phone_1: e.target.value })}
                        />
                        <label htmlFor="Email">Phone 2</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editUser.phone_2}
                            onChange={(e) => setEditUser({ ...editUser, phone_2: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <button className="view-button" onClick={handleEditUser}>Update</button>
                            <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}

export default UsersProfile;
