import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUpload, FaTrash, FaEdit } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';
import './LibrariesPage.css'

const API_URL = import.meta.env.VITE_API_URL;

const INITIAL_DATA = {
  name: '',
  instructions: '',
  img_1: '',
  img_2: '',
  img_3: '',
  img_4: ''
};

function ExerciseLibPage() {
  const navigate = useNavigate();
  const { branchId } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editExercise, setEditExercise] = useState(INITIAL_DATA);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createExercise, setCreateExercise] = useState(INITIAL_DATA);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.post(`${API_URL}/api/exercises/get-exercise-list`)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ✅ Unified File Upload Button
  const FileUploadButton = ({ id, formState, setFormState }) => {
    const fileUrl = formState[id];

    const handleRemoveFile = (key) => {
      setFormState((prev) => ({ ...prev, [key]: '' }));
      toast.success("File removed");
    };

    const handleFileUpload = async (event, key) => {
      const file = event.target.files[0];
      if (!file) return;

      const timestamp = Date.now();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const ext = file.name.split(".").pop();
      const newFileName = `${key}_${timestamp}_${randomNum}.${ext}`;

      const renamedFile = new File([file], newFileName, { type: file.type });

      const formData = new FormData();
      formData.append("file", renamedFile);
      formData.append("type", "exercise_files");

      try {
        const res = await axios.post(
          `${API_URL}/api/files/upload-file`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedUrl = res.data.url;
        setFormState((prev) => ({ ...prev, [key]: uploadedUrl }));
      } catch (err) {
        console.error("Upload failed:", err);
        toast.error("Upload failed");
      }
    };

    if (fileUrl) {
      return (
        <div className="uploaded-file-actions">
          <button
            type="button"
            className="icon-button image-view-button"
            onClick={() => window.open(fileUrl, "_blank")}
            title="View"
          >
            View
          </button>
          <button
            type="button"
            className="icon-button image-remove-button"
            onClick={() => handleRemoveFile(id)}
            title="Remove"
          >
            <FaTrash />
          </button>
        </div>
      );
    }

    return (
      <>
        <label htmlFor={id} className="upload-image-button">
          <FaUpload /> Upload
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id={id}
          onChange={(e) => handleFileUpload(e, id)}
        />
      </>
    );
  };

  // ✅ Create Exercise
  const handleCreateExercise = () => {
    if (!createExercise.name.trim()) {
      toast.error("Please enter exercise name");
      return;
    }

    axios.post(`${API_URL}/api/exercises/create-new-exercise`, createExercise)
      .then(() => {
        setCreateExercise(INITIAL_DATA);
        fetchUsers();
        setShowCreateModal(false);
        toast.success("Exercise created successfully");
      })
      .catch((error) => {
        console.error('Error adding exercise:', error);
        toast.error("Something went wrong while creating exercise");
      });
  };

  const handleCreateExerciseClose = () => {
    setCreateExercise(INITIAL_DATA);
    setShowCreateModal(false);
  };

  // ✅ Edit Exercise
  const handleEditExercise = () => {
    if (!editExercise.name.trim()) {
      toast.error("Please enter exercise name");
      return;
    }

    axios.post(`${API_URL}/api/exercises/update-exercise`, editExercise)
      .then(() => {
        fetchUsers();
        setShowEditModal(false);
        toast.success("Exercise updated successfully");
      })
      .catch((error) => {
        console.error('Error updating exercise:', error);
        toast.error("Something went wrong while updating exercise");
      });
  };

  // const handleDeleteExercise = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this exercise?")) {
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(`${API_URL}/api/exercises/delete-exercise`, {
  //       record_id: id,
  //     });

  //     if (res.status === 200) {
  //       toast.success("Exercise deleted successfully");
  //       fetchUsers(); // refresh the list
  //     }
  //   } catch (error) {
  //     console.error("Error deleting exercise:", error);
  //     toast.error("Something went wrong while deleting exercise");
  //   }
  // };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    // 🔹 Optimistic update (remove from UI immediately)
    const prevUsers = [...users];
    setUsers(users.filter((u) => u.id !== id));

    try {
      const res = await axios.post(`${API_URL}/api/exercises/delete-exercise`, {
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  var page_count = `Showing ${indexOfFirstUser + 1} to ${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length}`

  if (loading) return <p></p>;

  return (
    <div className="common-page-layout">
      <div className="common-page-header">
        <h1>Exercises</h1>
        <div className="filters">
          <button className='primary-button' onClick={() => setShowCreateModal(true)}>Add Exercise</button>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search Exercise here..."
              value={searchTerm}
              className='search-input'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="common-table-wrapper">
        <table className="common-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  {user.instructions && user.instructions.length > 50
                    ? user.instructions.substring(0, 50) + "..."
                    : user.instructions}
                </td>
                <td>
                  <div className='lib-tool-buttons'>
                    <button
                      title="Edit"
                      onClick={() => {
                        setEditExercise(user);
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

      {/* Pagination */}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="trainer-modal-overlay">
          <div className="trainer-modal-content">
            <h2>Edit Exercise</h2>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editExercise.name}
                  onChange={(e) => setEditExercise({ ...editExercise, name: e.target.value })}
                />
              </div>
            </div>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Instructions">Instructions</label>
                <textarea
                  name="Instructions"
                  value={editExercise.instructions}
                  onChange={(e) => setEditExercise({ ...editExercise, instructions: e.target.value })}
                  placeholder="How to perform"
                />
              </div>
            </div>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Images">Images</label>
                <div className='image-upload-array'>
                  <FileUploadButton id="img_1" formState={editExercise} setFormState={setEditExercise} />
                  <FileUploadButton id="img_2" formState={editExercise} setFormState={setEditExercise} />
                  <FileUploadButton id="img_3" formState={editExercise} setFormState={setEditExercise} />
                  <FileUploadButton id="img_4" formState={editExercise} setFormState={setEditExercise} />
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="view-button" onClick={handleEditExercise}>Update</button>
              <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="trainer-modal-overlay">
          <div className="trainer-modal-content">
            <h2>Create Exercise</h2>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={createExercise.name}
                  onChange={(e) => setCreateExercise({ ...createExercise, name: e.target.value })}
                />
              </div>
            </div>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Instructions">Instructions</label>
                <textarea
                  name="Instructions"
                  value={createExercise.instructions}
                  onChange={(e) => setCreateExercise({ ...createExercise, instructions: e.target.value })}
                  placeholder="How to perform"
                />
              </div>
            </div>

            <div className="trainer-model-data-field-row">
              <div className="trainer-model-data-field trainer-model-data-field-1">
                <label htmlFor="Images">Images</label>
                <div className='image-upload-array'>
                  <FileUploadButton id="img_1" formState={createExercise} setFormState={setCreateExercise} />
                  <FileUploadButton id="img_2" formState={createExercise} setFormState={setCreateExercise} />
                  <FileUploadButton id="img_3" formState={createExercise} setFormState={setCreateExercise} />
                  <FileUploadButton id="img_4" formState={createExercise} setFormState={setCreateExercise} />
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="view-button" onClick={handleCreateExercise}>Add</button>
              <button className="cancel-button" onClick={handleCreateExerciseClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {users.length === 0 && (
        <div className='appointments-default-message'>
          <FaUsers className='appointments-default-logo' />
          <div className='appointments-default-text'>No Users Yet</div>
        </div>
      )}

      {/* Toast */}
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

export default ExerciseLibPage;
