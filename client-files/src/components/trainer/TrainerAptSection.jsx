import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import { FaUpload, FaTrash, FaEye } from "react-icons/fa";


import './TrainerAptSection.css'


const API_URL = import.meta.env.VITE_API_URL

const INITIAL_DATA = {
    name: '',
    instructions: '',
    img_1: '',
    img_2: '',
    img_3: '',
    img_4: ''
}

const TrainerAptSection = ({ patient_id, appointment_id }) => {

    //-- TO CREATE A NEW EXERCISE
    const [createExercise, setCreateExercise] = useState(INITIAL_DATA);
    const [exercises, setExercises] = useState([]);

    //-- TO CREATE ADD EXERCISE TO APPOINTMENT
    const [newExercise, setNewExercise] = useState({
        exercise_id: '',
        exercise_name: '',
        reps: '',
        sets: ''
    });
    const [appointmentExercises, setAppointmentExercises] = useState([]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [selectedExercise, setSelectedExercise] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchAppointmentExercises();
        fetchExercises()
    }, []);

    const fetchExercises = () => {
        axios.post(`${API_URL}/api/exercises/get-exercise-list`)
            .then((response) => {
                setExercises(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            })
    };

    const fetchAppointmentExercises = () => {
        axios.post(`${API_URL}/api/exercises/get-appointment-exercise-list`, { "appointment_id": appointment_id })
            .then((response) => {
                setAppointmentExercises(response.data.data);
                fetchExercises()
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            })
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
        setShowCreateModal(false)
    }

    const handleAddExercise = () => {
        if (!newExercise.exercise_name.trim()) {
            toast.error("Please select an exercise");
            return;
        }
        if (!newExercise.reps.trim()) {
            toast.error("Please enter reps");
            return;
        }
        if (!newExercise.sets.trim()) {
            toast.error("Please enter sets");
            return;
        }

        const payload = {
            ...newExercise,
            patient_id,
            appointment_id
        };

        axios.post(`${API_URL}/api/exercises/add-new-exercise`, payload)
            .then(() => {
                setNewExercise(INITIAL_DATA);
                fetchAppointmentExercises();
                setShowAddModal(false);
                toast.success("Exercise added successfully");
            })
            .catch((error) => {
                console.error('Error adding appointment exercise:', error);
                toast.error("Something went wrong while adding exercise");
            });
    };

    const handleRemoveFile = (key) => {
        setCreateExercise((prev) => ({
            ...prev,
            [key]: ''   // clears the uploaded file url
        }));
        toast.success("File removed");
    };

    const FileUploadButton = ({ id }) => {
        const fileUrl = createExercise[id];  // ✅ always use id directly

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
                        onClick={() => handleRemoveFile(id)}  // ✅ pass id
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
                    onChange={(e) => handleFileUpload(e, id)}  // ✅ only pass id
                />
            </>
        );
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
            setCreateExercise((prev) => ({ ...prev, [key]: uploadedUrl }));  // ✅ store with id

        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed");
        }
    };

    const handleDeleteExercise = async (record_id) => {
        try {
            await axios.post(`${API_URL}/api/exercises/delete-appointment-exercise`, {
                record_id,
            });

            toast.success("Exercise deleted successfully");

            // ✅ Refresh table after delete
            fetchAppointmentExercises();
        } catch (error) {
            console.error("Error deleting exercise:", error);
            toast.error("Failed to delete exercise");
        }
    };

    return (
        <div>
            <div className='trainerAptSection-header'>

                <h1>Exercises</h1>
                <div>
                    <button className='view-button' onClick={() => setShowCreateModal(true)}>New</button>
                    <button className='view-button' onClick={() => setShowAddModal(true)}>Add</button>
                </div>
            </div>
            <div className="table-wrapper">
                <Toaster position="top-right" reverseOrder={false} />


                {showCreateModal && (
                    <div>
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
                                        <label htmlFor="Subjective">Instructions</label>
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
                                        <label htmlFor="Name">Images</label>
                                        <div className='image-upload-array'>
                                            <FileUploadButton id="img_1" />
                                            <FileUploadButton id="img_2" />
                                            <FileUploadButton id="img_3" />
                                            <FileUploadButton id="img_4" />
                                        </div>
                                    </div>
                                </div>


                                <div className="modal-buttons">
                                    <button className="view-button" onClick={() => handleCreateExercise()}>Add</button>
                                    <button className="cancel-button" onClick={() => handleCreateExerciseClose(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showAddModal && (
                    <div>
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Add Exercise</h2>
                                <label htmlFor="Name">Name</label>
                                <select
                                    id="exercise"
                                    value={newExercise.exercise_id}
                                    onChange={(e) => {
                                        const selected = exercises.find(ex => ex.id === parseInt(e.target.value));
                                        setNewExercise({
                                            ...newExercise,
                                            exercise_id: selected?.id || '',
                                            exercise_name: selected?.name || ''
                                        });
                                    }}
                                >
                                    <option value="">Select Exercise</option>
                                    {exercises.map((exercise) => (
                                        <option key={exercise.id} value={exercise.id}>
                                            {exercise.name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="Reps">Reps</label>
                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={newExercise.reps}
                                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                                />

                                <label htmlFor="Name">Sets</label>
                                <input
                                    type="number"
                                    placeholder="Sets"
                                    value={newExercise.sets}
                                    onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                                />
                                <div className="modal-buttons">
                                    <button className="view-button" onClick={() => handleAddExercise()}>Add</button>
                                    <button className="cancel-button" onClick={() => setShowAddModal(false)}>Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {showViewModal && selectedExercise && (
                    <div>
                        <div className="trainer-modal-overlay">
                            <div className="trainer-modal-content">
                                <h2>{selectedExercise.name}</h2>

                                <div className="exercise-images-grid">
                                    {['img_1', 'img_2', 'img_3', 'img_4'].map((key, i) =>
                                        selectedExercise[key] ? (
                                            <img
                                                key={i}
                                                src={selectedExercise[key]}
                                                alt={`${selectedExercise.name} step ${i + 1}`}
                                                className="exercise-image"
                                            />
                                        ) : null
                                    )}
                                </div>

                                <div className="trainer-model-data-field-row">
                                    <div className="trainer-model-data-field trainer-model-data-field-1">
                                        <label htmlFor="Name">How to Perform</label>
                                        <textarea name="" id="" readOnly>
                                            {selectedExercise.instructions}
                                        </textarea>
                                    </div>
                                </div>

                                <div className="modal-buttons">
                                    <button className="cancel-button" onClick={() => setShowViewModal(false)}>Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Name</th>
                            <th>Reps</th>
                            <th>Sets</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointmentExercises.map((appointmentExercise, index) => (
                            <tr key={appointmentExercise.id}>
                                <td>{index + 1}</td>
                                <td>{appointmentExercise.exercise_name}</td>
                                <td>{appointmentExercise.reps}</td>
                                <td>{appointmentExercise.sets}</td>

                                <td className='table-action-buttons-grid'>
                                    <button
                                        className="table-action-buttons"
                                        onClick={() => {
                                            const exercise = exercises.find(ex => ex.id == appointmentExercise.exercise_id);
                                            setSelectedExercise(exercise);
                                            setShowViewModal(true);
                                        }}
                                    >
                                        <FaEye className='table-action-buttons-icons'/>
                                    </button>
                                    <button
                                        className="table-action-buttons"
                                        onClick={() => handleDeleteExercise(appointmentExercise.id)}
                                    >
                                        <FaTrash className='table-action-buttons-icons'/>
                                    </button>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TrainerAptSection