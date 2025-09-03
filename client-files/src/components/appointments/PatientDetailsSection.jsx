import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import { FaUpload, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";


function PatientDetailsSection({ patientData, updatePatientData, isReadOnly }) {
    const { patientId, apptId } = useParams();


    return (
        <div>
            <h1>Patient Details: {patientId}</h1>

            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label htmlFor="Name">Name</label>
                    <input
                        name="name"
                        value={patientData.name ?? ''}
                        onChange={(e) => updatePatientData({ name: e.target.value })}
                        placeholder="Name"
                        disabled={isReadOnly}
                    />
                </div>
                <div className="data-field data-field-2">
                    <label htmlFor="address">Address</label>
                    <input
                        name="address"
                        value={patientData.address ?? ''}
                        onChange={(e) => updatePatientData({ address: e.target.value })}
                        placeholder="Address"
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
                    />
                </div>
                <div className="data-field data-field-4">
                    <label htmlFor="occupation">Occupation</label>
                    <input
                        name="occupation"
                        value={patientData.occupation ?? ''}
                        onChange={(e) => updatePatientData({ occupation: e.target.value })}
                        placeholder="Occupation"
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
                    />
                </div>
                <div className="data-field data-field-2">
                    <label htmlFor="chief_complaints">Other Ailments</label>
                    <input
                        name="other_ailments"
                        value={patientData.other_ailments ?? ''}
                        onChange={(e) => updatePatientData({ other_ailments: e.target.value })}
                        placeholder="Other Ailments"
                        disabled={isReadOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default PatientDetailsSection;
