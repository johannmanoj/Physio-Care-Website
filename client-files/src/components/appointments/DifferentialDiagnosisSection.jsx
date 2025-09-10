import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { FaUpload, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;


function DifferentialDiagnosisSection({ patientData, updatePatientData, isReadOnly }) {
    

    const handleRemoveFile = (key) => {
        updatePatientData({ [key]: "" }); // clear the file URL
    };

    const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    // extract type from key (e.g., xray_file_1 → xray)
    const type = key.split("_")[0];

    // generate timestamp + random 5-digit number
    const timestamp = Date.now();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // always 5 digits

    // preserve file extension
    const ext = file.name.split(".").pop();
    const newFileName = `${type}_${timestamp}_${randomNum}.${ext}`;

    // create new File object with the renamed file
    const renamedFile = new File([file], newFileName, { type: file.type });

    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("type", "medical_files");

    try {
      const res = await axios.post(
        `${API_URL}/api/files/upload-file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrl = res.data.url;
      updatePatientData({ [key]: uploadedUrl });

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

    const FileUploadButton = ({ id, fileKey }) => {
        const fileUrl = patientData[fileKey];

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
                    <FaTrash type="button"
                        className="icon-button image-remove-button"
                        onClick={() => handleRemoveFile(fileKey)}
                        title="Remove"
                    />
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
                    onChange={(e) => handleFileUpload(e, fileKey)}
                    disabled={isReadOnly}
                />
            </>
        );
    };


    return (
        <div>
            <h2 className='appointment-details-sub-heading'>Differential Diagnosis</h2>

            <div className="data-field-row">
                <div className="data-field data-field-1">
                    <label htmlFor="Desciption">Special Test</label>
                    <textarea
                        name="special_test_desc"
                        value={patientData.special_test_desc ?? ''}
                        onChange={(e) => updatePatientData({ special_test_desc: e.target.value })}
                        placeholder="Enter subjective description"
                        disabled={isReadOnly}
                    />
                </div>
            </div>

            {/* X-Ray, MRI, Ultrasound, Blood Report */}
            <div className="data-field-row">
                <div className="data-field data-field-1">
                    <label>X-Ray</label>
                    <textarea
                        name="xray_desc"
                        value={patientData.xray_desc ?? ''}
                        onChange={(e) => updatePatientData({ xray_desc: e.target.value })}
                        placeholder="Description"
                        disabled={isReadOnly}
                    />
                    <div className="image-upload-array">
                        <FileUploadButton id="xray-upload-1" fileKey="xray_file_1" />
                        <FileUploadButton id="xray-upload-2" fileKey="xray_file_2" />
                        <FileUploadButton id="xray-upload-3" fileKey="xray_file_3" />
                        <FileUploadButton id="xray-upload-4" fileKey="xray_file_4" />
                    </div>
                </div>
                <div className="data-field data-field-1">
                    <label>MRI</label>
                    <textarea
                        name="mri_desc"
                        value={patientData.mri_desc ?? ''}
                        onChange={(e) => updatePatientData({ mri_desc: e.target.value })}
                        placeholder="Description"
                        disabled={isReadOnly}
                    />
                    <div className='image-upload-array'>
                        <FileUploadButton id="mri-upload-1" fileKey="mri_file_1" />
                        <FileUploadButton id="mri-upload-2" fileKey="mri_file_2" />
                        <FileUploadButton id="mri-upload-3" fileKey="mri_file_3" />
                        <FileUploadButton id="mri-upload-4" fileKey="mri_file_4" />

                    </div>
                </div>
            </div>

            <div className="data-field-row">
                <div className="data-field data-field-1">
                    <label>Ultrasound</label>
                    <textarea
                        name="ultrasound_desc"
                        value={patientData.ultrasound_desc ?? ''}
                        onChange={(e) => updatePatientData({ ultrasound_desc: e.target.value })}
                        placeholder="Description"
                        disabled={isReadOnly}
                    />
                    <div className='image-upload-array'>
                        <FileUploadButton id="ultrasound-upload-1" fileKey="ultrasound_file_1" />
                        <FileUploadButton id="ultrasound-upload-2" fileKey="ultrasound_file_2" />
                        <FileUploadButton id="ultrasound-upload-3" fileKey="ultrasound_file_3" />
                        <FileUploadButton id="ultrasound-upload-4" fileKey="ultrasound_file_4" />
                    </div>
                </div>
                <div className="data-field data-field-1">
                    <label>Blood Report</label>
                    <textarea
                        name="blood_report_desc"
                        value={patientData.blood_report_desc ?? ''}
                        onChange={(e) => updatePatientData({ blood_report_desc: e.target.value })}
                        placeholder="Description"
                        disabled={isReadOnly}
                    />
                    <div className='image-upload-array'>
                        <FileUploadButton id="blood-report-upload-1" fileKey="blood_report_file_1" />
                        <FileUploadButton id="blood-report-upload-2" fileKey="blood_report_file_2" />
                        <FileUploadButton id="blood-report-upload-3" fileKey="blood_report_file_3" />
                        <FileUploadButton id="blood-report-upload-4" fileKey="blood_report_file_4" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DifferentialDiagnosisSection;
