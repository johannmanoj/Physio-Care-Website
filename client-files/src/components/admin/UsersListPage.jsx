import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";

import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';

import './UsersListPage.css';

const API_URL = import.meta.env.VITE_API_URL

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
  const [newUser, setNewUser] = useState({ email: '', password: '', role: '', name: '', branch_id: branchId });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', email: '', role: '', name: '' });

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

  // const handleAddUser = () => {
  //   axios.post(`${API_URL}/api/users/add-user`, newUser)
  //     .then(() => {
  //       setShowAddModal(false);
  //       setNewUser({ email: '', password: '', role: '', name: '' });
  //       fetchUsers();
  //     })
  //     .catch((error) => {
  //       console.error('Error adding user:', error);
  //     });
  // };

  const handleAddUser = () => {
    const { name, email, password, role } = newUser;

    // ✅ Validation check
    if (!name || !email || !password || !role) {
      toast.error("Please fill all fields before saving user.");
      return;
    }

    axios.post(`${API_URL}/api/users/add-user`, newUser)
      .then(() => {
        toast.success("User added successfully!");
        setShowAddModal(false);
        setNewUser({ email: '', password: '', role: '', name: '', branch_id: branchId });
        fetchUsers();
      })
      .catch((error) => {
        toast.error("Failed to add user. Try again.");
        console.error('Error adding user:', error);
      });
  };


  const handleEditUser = () => {
    axios.post(`${API_URL}/api/users/update-user`, editUser)
      .then(() => {
        setShowEditModal(false);
        setEditUser({ id: '', email: '', role: '', name: '' });
        fetchUsers();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="common-page-layout">
      <div className="common-page-header">
        <h1>Users</h1>
        <div className="filters">
          <button className='primary-button' onClick={() => setShowAddModal(true)}>Add User</button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by Role</option>
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
              <th>Actions</th>
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
                    // onClick={() => {
                    //   setEditUser({ id: user.id, email: user.email, role: user.role , name:user.name});
                    //   setShowEditModal(true);
                    // }}
                    onClick={() => navigate(`/userPage/${user.id}`)}
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
        <PaginationFooter
          page_count={page_count}
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
            <h2>Add New User</h2>
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <label htmlFor="Role">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {statuses.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
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
            <h2>Edit User</h2>
            <label htmlFor="Id">User Id</label>
            <input
              type="text"
              value={editUser.id}
              readOnly
            />
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <label htmlFor="Role">Role</label>
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {statuses.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
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
