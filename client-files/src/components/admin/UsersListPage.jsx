import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers , FaEye} from 'react-icons/fa';
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

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const statuses = ['Admin', 'Trainer', 'Therapist', 'Receptionist'];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const payload = {
        branch_id: branchId,
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
        role: filterStatus
      };

      const response = await axios.post(`${API_URL}/api/users/get-all-users-list`, payload);
      const { data, total, totalPages } = response.data;

      setUsers(data);
      setTotalUsers(total);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch on page, search, or filter change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus]);

  // ✅ Reset page on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);


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


  // if (loading) { return <p></p>; }
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
            <option value="">All Role</option>
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
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "30px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone ?? 'N/A' }</td>
                <td>{user.role}</td>
                <td className='commn-table-action-td'>
                  <div className='common-table-action-btn-layout'>
                    <FaEye
                      className='common-table-action-btn'
                      onClick={() => navigate(`/userPage/${user.id}`)}
                    />
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length == 0 && (
        <div className='appointments-default-message'>
          {/* <FaUsers className='appointments-default-logo' /> */}
          <div className='appointments-default-text'>No Users Yet</div>
        </div>
      )}

      {totalUsers > 0 && (
        <div className="table-footer">
          <PaginationFooter
            page_count={`Showing ${(currentPage - 1) * usersPerPage + 1} to ${Math.min(currentPage * usersPerPage, totalUsers)} of ${totalUsers}`}
            playersPerPage={usersPerPage}
            totalPlayers={totalUsers}
            paginate={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}


      {/* Add User Modal */}
      {showAddModal && (
        <div className="common-modal-overlay">
          <div className="common-modal-content">
            <div className="common-modal-header">
              <h1>Add New User</h1>
            </div>

            <div className="common-modal-body">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
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
            </div>

            <div className="common-modal-footer-layout">
              <button className="common-modal-buttons-close" onClick={() => setShowAddModal(false)}>Close</button>
              <button className="common-modal-buttons-success" onClick={handleAddUser}> Add </button>
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
