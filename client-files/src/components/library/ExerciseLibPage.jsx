import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUpload, FaTrash, FaEdit, FaDumbbell  } from 'react-icons/fa';
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

  const [exercises, setExercises] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);
  const [exercisesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editExercise, setEditExercise] = useState(INITIAL_DATA);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createExercise, setCreateExercise] = useState(INITIAL_DATA);

  useEffect(() => {
    fetchExercises();
  }, [branchId, searchTerm, currentPage]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/exercises/get-all-exercises-list`, {
        branch_id: branchId,
        search: searchTerm,
        page: currentPage,
        limit: exercisesPerPage,
      });
      setExercises(response.data.data);
      setTotalExercises(response.data.total);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalExercises / exercisesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfFirstExercise = (currentPage - 1) * exercisesPerPage;
  const indexOfLastExercise = indexOfFirstExercise + exercises.length;
  const page_count = `Showing ${indexOfFirstExercise + 1} to ${indexOfLastExercise} of ${totalExercises}`;




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

  const handleCreateExercise = () => {
    if (!createExercise.name.trim()) {
      toast.error("Please enter exercise name");
      return;
    }

    axios.post(`${API_URL}/api/exercises/create-new-exercise`, createExercise)
      .then(() => {
        setCreateExercise(INITIAL_DATA);
        fetchExercises();
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

  const handleEditExercise = () => {
    if (!editExercise.name.trim()) {
      toast.error("Please enter exercise name");
      return;
    }

    axios.post(`${API_URL}/api/exercises/update-exercise`, editExercise)
      .then(() => {
        fetchExercises();
        setShowEditModal(false);
        toast.success("Exercise updated successfully");
      })
      .catch((error) => {
        console.error('Error updating exercise:', error);
        toast.error("Something went wrong while updating exercise");
      });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    // 🔹 Optimistic update (remove from UI immediately)
    const prevUsers = [...exercises];
    setExercises(exercises.filter((u) => u.id !== id));

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
      setExercises(prevUsers);
    }
  };

  // if (loading) return <p></p>;

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
            {exercises.map(ex => (
              <tr key={ex.id}>
                <td>{ex.id}</td>
                <td>{ex.name}</td>
                <td>
                  {ex.instructions && ex.instructions.length > 50
                    ? ex.instructions.substring(0, 50) + "..."
                    : ex.instructions}
                </td>
                <td>
                  <div className='lib-tool-buttons'>
                    <button
                      title="Edit"
                      onClick={() => {
                        setEditExercise(ex);
                        setShowEditModal(true);
                      }}
                    ><FaEdit /></button>
                    <button
                      onClick={() => handleDeleteExercise(ex.id)}
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
          playersPerPage={exercisesPerPage}
          totalPlayers={totalExercises}
          paginate={paginate}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="common-modal-overlay">
          <div className="common-medium-modal-content">

            <div className="common-modal-header">
              <h1>Edit Exercise</h1>
            </div>
            
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

            <div className="common-modal-footer-layout">
              <button className="common-modal-buttons-close" onClick={() => setShowEditModal(false)}>Close</button>
              <button className="common-modal-buttons-success" onClick={handleEditExercise}>Update</button>
            </div>

            {/* <div className="modal-buttons">
              <button className="view-button" onClick={handleEditExercise}>Update</button>
              <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div> */}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="common-modal-overlay">
          <div className="common-medium-modal-content">
            <div className="common-modal-header">
              <h1>Create Exercise</h1>
            </div>

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

            <div className="common-modal-footer-layout">
              <button className="common-modal-buttons-close" onClick={handleCreateExerciseClose}>Close</button>
              <button className="common-modal-buttons-success" onClick={handleCreateExercise}> Add </button>
            </div>

            {/* <div className="modal-buttons">
              <button className="view-button" onClick={handleCreateExercise}>Add</button>
              <button className="cancel-button" onClick={handleCreateExerciseClose}>Close</button>
            </div> */}
          </div>
        </div>
      )}

      {/* Empty state */}
      {exercises.length === 0 && (
        <div className='appointments-default-message'>
          <FaDumbbell className='appointments-default-logo' />
          <div className='appointments-default-text'>No Exercises Found</div>
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
