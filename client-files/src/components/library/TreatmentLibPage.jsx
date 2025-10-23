import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers, FaTrash, FaEdit } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';

const API_URL = import.meta.env.VITE_API_URL

function TreatmentLibPage() {
  const navigate = useNavigate();
  const { branchId } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalTreatments, setTotalTreatments] = useState(0);
  // const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', rate: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', treatment: '', rate: '' });

  // Fetch page whenever branch, search or page changes
  useEffect(() => {
    fetchUsers();
  }, [branchId, searchTerm, currentPage]);

  // Reset to page 1 when searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/exercises/get-all-treatments-list`, {
        branch_id: branchId,
        search: searchTerm,
        page: currentPage,
        limit: perPage,
      });

      // backend should return { data: [...], total: N }
      setUsers(res.data.data || []);
      setTotalTreatments(typeof res.data.total === 'number' ? res.data.total : (res.data.total || 0));
    } catch (err) {
      console.error('Error fetching treatments:', err);
      toast.error("Failed to fetch treatments");
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = () => {
  //   axios.post(`${API_URL}/api/exercises/get-treatments-list`)
  //     .then((response) => {
  //       setUsers(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching users:', error);
  //     })
  //     .finally(() => {
  //       setLoading(false); // ✅ stop loading after request finishes
  //     });
  // };

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

  const totalPages = Math.ceil(totalTreatments / perPage);
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const indexOfFirst = (currentPage - 1) * perPage;
  const indexOfLast = indexOfFirst + users.length;
  const page_count = `Showing ${indexOfFirst + 1} to ${indexOfLast} of ${totalTreatments}`;





  // if (loading) { return <p></p>; }
  return (
    <div className="common-page-layout">
      <div className="common-page-header">
        <h1>Treatments</h1>
        <div className="filters">
          <button className='primary-button' onClick={() => setShowAddModal(true)}>Add Treatment</button>

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
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "80px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>Treatment</th>
              <th>Cost / hr</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
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
        <PaginationFooter
          page_count={page_count}
          playersPerPage={perPage}
          totalPlayers={totalTreatments}
          paginate={paginate}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="common-modal-overlay">
          <div className="common-modal-content">

            <div className="common-modal-header">
              <h1>Add New Treatment</h1>
            </div>

            <div className="common-modal-body">
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
        <div className="common-modal-overlay">
          <div className="common-modal-content">

            <div className="common-modal-header">
              <h1>Edit Treatment</h1>
            </div>

            <div className="common-modal-body">
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
            </div>

            <div className="common-modal-footer-layout">
              <button className="common-modal-buttons-close" onClick={() => setShowEditModal(false)}>Close</button>
              <button className="common-modal-buttons-success" onClick={handleEditUser}> Update </button>
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
