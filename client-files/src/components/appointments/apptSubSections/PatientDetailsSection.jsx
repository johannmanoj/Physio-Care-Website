import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import { FaUpload, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;


function PatientDetailsSection({ }) {
    const { patientId, apptId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [patientData, setPatientData] = useState(false);

    useEffect(() => {
        axios.post(`${API_URL}/api/patients/get-patient-details`, { "patient_id": patientId })
            .then((response) => {
                if (response.data.data.length > 0) {
                    const userData = response.data.data[0];
                    setPatientData(userData);
                }
            })
            .catch((error) => {
                console.error('Error fetching players data:', error);
            });
    }, []);

    const updatePatientData = (newData) => {
        setPatientData(prev => ({ ...prev, ...newData }));
    };

    const handleSave = async () => {
        try {
            await axios.post(`${API_URL}/api/patients/update-patient-details`, patientData);
            toast.success("Patient details updated successfully!");
            setShowEditModal(false)
        } catch (err) {
            console.error('Error updating patient:', err);
            toast.error("Something went wrong!");
        }
    };



    return (
        <div>
            <div className='profile-page-header'>
                <h1>Patient Details: {patientId}</h1>
                <button className='common-field-edit-button' onClick={() => setShowEditModal(true)}><FaPencilAlt /> Edit</button>

            </div>

            <div className='common-readonly-sections'>
                <div className='data-field-row'>
                    <div className='data-field data-field-4'>
                        <h2>Name</h2>
                        <div className='profile-page-sections-label'>{patientData.patient_name ?? '-'}</div>
                    </div>
                    <div className='data-field data-field-4'>
                        <h2>Age</h2>
                        <div className='profile-page-sections-label'>{patientData.age ?? '-'}</div>
                    </div>
                    <div className='data-field data-field-4'>
                        <h2>Sex</h2>
                        <div className='profile-page-sections-label'>{patientData.sex ?? '-'}</div>
                    </div>

                </div>

                <div className='data-field-row'>
                    <div className='data-field data-field-4'>
                        <h2>Occupation</h2>
                        <div className='profile-page-sections-label'>{patientData.occupation ?? '-'}</div>
                    </div>
                    <div className='data-field data-field-4'>
                        <h2>Contact Number</h2>
                        <div className='profile-page-sections-label'>{patientData.contact_num ?? '-'}</div>
                    </div>
                    <div className='data-field data-field-4'>
                        <h2>Address</h2>
                        <div className='profile-page-sections-label'>{patientData.address ?? '-'}</div>
                    </div>
                </div>

                <div className='data-field-row'>

                    <div className='data-field data-field-4'>
                        <h2>Medicine Allergies</h2>
                        <div className='profile-page-sections-label'>{patientData.medical_allergies ?? '-'}</div>
                    </div>
                    <div className='data-field data-field-4'>
                        <h2>Other Ailments</h2>
                        <div className='profile-page-sections-label'>{patientData.other_ailments ?? '-'}</div>
                    </div>
                </div>
            </div>


            {showEditModal && (
                <div className="common-modal-overlay">
                    <div className="common-medium-modal-content">
                        <div className="common-modal-header">
                            <h1>Update Patient Details</h1>
                        </div>

                        <div className="common-modal-body">
                            <div className="data-field-row">
                                <div className="data-field data-field-2">
                                    <label htmlFor="Name">Name</label>
                                    <input
                                        name="name"
                                        value={patientData.patient_name ?? ''}
                                        onChange={(e) => updatePatientData({ patient_name: e.target.value })}
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="data-field data-field-2">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        name="address"
                                        value={patientData.address ?? ''}
                                        onChange={(e) => updatePatientData({ address: e.target.value })}
                                        placeholder="Address"
                                    />
                                </div>
                            </div>

                            <div className="data-field-row">
                                <div className="data-field data-field-4">
                                    <label htmlFor="sex">Sex</label>
                                    <select
                                        id="sex"
                                        value={patientData.sex ?? ''}
                                        onChange={(e) => updatePatientData({ sex: e.target.value })}
                                    >
                                        <option value="" disabled hidden>Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className="data-field data-field-4">
                                    <label htmlFor="age">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={patientData.age ?? ''}
                                        onChange={(e) => updatePatientData({ age: e.target.value })}
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="data-field data-field-4">
                                    <label htmlFor="contact">Contact Number</label>
                                    <input
                                        type="number"
                                        name="contact_num"
                                        value={patientData.contact_num ?? ''}
                                        onChange={(e) => updatePatientData({ contact_num: e.target.value })}
                                        placeholder="Contact Number"
                                    />
                                </div>
                                <div className="data-field data-field-4">
                                    <label htmlFor="occupation">Occupation</label>
                                    <input
                                        name="occupation"
                                        value={patientData.occupation ?? ''}
                                        onChange={(e) => updatePatientData({ occupation: e.target.value })}
                                        placeholder="Occupation"
                                    />
                                </div>
                            </div>

                            <div className="data-field-row">
                                <div className="data-field data-field-2">
                                    <label htmlFor="medicine-allergies">Medicine Allergies</label>
                                    <input
                                        name="medical_allergies"
                                        value={patientData.medical_allergies ?? ''}
                                        onChange={(e) => updatePatientData({ medical_allergies: e.target.value })}
                                        placeholder="Medical Allergies"
                                    />
                                </div>
                                <div className="data-field data-field-2">
                                    <label htmlFor="chief_complaints">Other Ailments</label>
                                    <input
                                        name="other_ailments"
                                        value={patientData.other_ailments ?? ''}
                                        onChange={(e) => updatePatientData({ other_ailments: e.target.value })}
                                        placeholder="Other Ailments"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="common-modal-footer-layout">
                            <button className="common-modal-buttons-close" onClick={() => setShowEditModal(false)}>Close</button>
                            <button className="common-modal-buttons-success" onClick={handleSave}> Save </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientDetailsSection;
