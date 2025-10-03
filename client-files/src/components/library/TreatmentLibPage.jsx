import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers, FaTrash, FaEdit } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import Pagination from '../common/Pagination';
// import './UsersListPage.css';

const API_URL = import.meta.env.VITE_API_URL

function TreatmentLibPage() {
  const navigate = useNavigate();
  const { branchId } = useAuth();


  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', rate: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', treatment: '', rate: '' });

  const statuses = ['Admin', 'Trainer', 'Therapist', 'Receptionist'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.post(`${API_URL}/api/exercises/get-treatments-list`)
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
    const { name, rate } = newUser;

    // ✅ Validation check
    if (!name || !rate) {
      toast.error("Please fill all fields before creating a treatment.");
      return;
    }

    axios.post(`${API_URL}/api/exercises/create-new-treatment`, newUser)
      .then(() => {
        toast.success("User added successfully!");
        setShowAddModal(false);
        setNewUser({ name: '', rate: '' });
        fetchUsers();
      })
      .catch((error) => {
        toast.error("Failed to add user. Try again.");
        console.error('Error adding user:', error);
      });
  };

  const handleEditUser = () => {
    axios.post(`${API_URL}/api/exercises/update-treatment`, editUser)
      .then(() => {
        setShowEditModal(false);
        setEditUser({ id: '', treatment: '', rate: '' });
        fetchUsers();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this treatment?")) {
      return;
    }

    // 🔹 Optimistic update (remove from UI immediately)
    const prevUsers = [...users];
    setUsers(users.filter((u) => u.id !== id));

    try {
      const res = await axios.post(`${API_URL}/api/exercises/delete-treatment`, {
        record_id: id,
      });

      if (res.status === 200) {
        toast.success("Exercise deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Something went wrong while deleting exercise");
      // 🔹 Rollback if API fails
      setUsers(prevUsers);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
        <h1>Treatments</h1>
        <div className="filters">
          <button className='view-button' onClick={() => setShowAddModal(true)}>Add Treatment</button>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search Treatment here..."
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
              <th>Treatment</th>
              <th>Cost / hr</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.treatment}</td>
                <td>₹ {user.rate}</td>
                <td>
                  <div className='lib-tool-buttons'>
                    <button
                      onClick={() => {
                        setEditUser({ id: user.id, treatment: user.treatment, rate: user.rate });
                        setShowEditModal(true);
                      }}
                    ><FaEdit /></button>
                    <button
                      onClick={() => handleDeleteExercise(user.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>

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
            <h2>Add New Treatment</h2>
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <label htmlFor="Email">Rate (₹)</label>
            <input
              type="number"
              placeholder="Rate"
              value={newUser.rate}
              onChange={(e) => setNewUser({ ...newUser, rate: e.target.value })}
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
            <h2>Edit Treatment</h2>
            <label htmlFor="Id">Treatment Id</label>
            <input
              type="text"
              value={editUser.id}
              readOnly
            />
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={editUser.treatment}
              onChange={(e) => setEditUser({ ...editUser, treatment: e.target.value })}
            />
            <label htmlFor="Email">Rate (₹)</label>
            <input
              type="number"
              placeholder="Rate"
              value={editUser.rate}
              onChange={(e) => setEditUser({ ...editUser, rate: e.target.value })}
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

export default TreatmentLibPage;
