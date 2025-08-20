import Select from "react-select";
import { useState, useEffect } from "react";
import axios from 'axios'
import './AddAppointment.css'
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL


function AddAppointment() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ patient_id: '', name: '', sex: '', age: '', contact_num: '', date: '', time: '', session_typ: '' })

    const [showAddModal, setShowAddModal] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', sex: '', age: '', contact_num: '' });

    const timeOptions = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let min of [0, 30]) {
            if (hour === 18 && min > 0) break; // stop at 6:00 PM
            const h = hour % 12 || 12;
            const ampm = hour < 12 ? "AM" : "PM";
            const label = `${h}:${min === 0 ? "00" : "30"} ${ampm}`;
            timeOptions.push({ value: label, label });
        }
    }

    const fetchPatients = () => {
        axios.post(`${API_URL}/api/patients/get-patient-list`)
            .then((response) => {
                setPatients(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching patients data:', error);
            });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddPatient = () => {
        axios.post(`${API_URL}/api/patients/add-new-patient`, newPatient)
            .then(() => {
                setShowAddModal(false);
                setNewPatient({ name: '', sex: '', age: '', contact_num: '' });
                fetchPatients(); // 🔥 refresh patients list after adding
            })
            .catch((error) => {
                console.error('Error adding patient:', error);
            });
    };

    const handleAddAppointment = () => {
        axios.post(`${API_URL}/api/appointments/add-new-appointment`, newAppointment)
            .then(() => {
                setNewAppointment({ patient_id: '', name: '', sex: '', age: '', contact_num: '', date: '', time: '', session_typ: '' });
                navigate("/appointments")
            })
            .catch((error) => {
                console.error('Error adding patient:', error);
            });
    };

    return (
        <div className="profile-page">
            <div className="create-appointment-header">
                <h1>Create Appointment</h1>
                <button className="add-patient-button" onClick={() => setShowAddModal(true)}>Add Patient</button>
            </div>

            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label htmlFor="therapist-id">Patient</label>
                    <Select
                        options={patients.map((p) => ({
                            value: p.id,
                            label: `${p.id} - ${p.patient_name}`,
                            data: p, // 👈 keep full patient object
                        }))}
                        className="patient-select"
                        classNamePrefix="rs"
                        placeholder="Select Patient"
                        menuPlacement="bottom"
                        styles={{
                            menuList: (base) => ({
                                ...base,
                                maxHeight: "180px",
                                overflowY: "auto",
                            }),
                        }}
                        onChange={(selectedOption) => {
                            const p = selectedOption.data;
                            setNewAppointment({
                                ...newAppointment,
                                patient_id: p.id,
                                name: p.patient_name,
                                sex: p.sex,
                                age: p.age,
                                contact_num: p.contact_num,
                            });
                        }}
                    />

                </div>

                <div className="data-field data-field-2">
                    <label htmlFor="session_type">Session Type</label>
                    <input
                        type="text"
                        onChange={(e) => setNewAppointment({ ...newAppointment, session_typ: e.target.value })}
                    />
                </div>
            </div>

            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="data-field data-field-2">
                    <label htmlFor="time">Time</label>
                    <Select
                        options={timeOptions}
                        onChange={(selectedOption) =>
                            setNewAppointment({ ...newAppointment, time: selectedOption.value })}
                        className="time-select"
                        classNamePrefix="rs"
                        menuPlacement="bottom"   // force dropdown down
                        styles={{
                            menuList: (base) => ({
                                ...base,
                                maxHeight: "180px", // ≈6 slots
                                overflowY: "auto",
                            }),
                        }}
                    />
                </div>
            </div>

            <div className="profile-save">
                <button onClick={handleAddAppointment}>Create</button>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Patient</h2>
                        <label>Name</label>
                        <input
                            type="name"
                            placeholder="Name"
                            // value={newUser.email}
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        />
                        <label>Sex</label>
                        <input
                            type="sex"
                            placeholder="Sex"
                            // value={newPatient.password}
                            onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                        />
                        <label>Age</label>
                        <input
                            type="age"
                            placeholder="Age"
                            // value={newPatient.password}
                            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                        />
                        <label>Contact Number</label>
                        <input
                            type="contact_number"
                            placeholder="Contact Number"
                            // value={newPatient.password}
                            onChange={(e) => setNewPatient({ ...newPatient, contact_num: e.target.value })}
                        />

                        <div className="modal-buttons">
                            <button className="view-button" onClick={handleAddPatient}>Add</button>
                            <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAppointment;
