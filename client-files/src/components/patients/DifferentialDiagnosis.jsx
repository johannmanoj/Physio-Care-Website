import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL
import './DifferentialDiagnosis.css'

import { FaUpload } from "react-icons/fa";

function DifferentialDiagnosis({ data, onDataChange }) {
  const TABS = ['Special Test', 'Investigation'];
  const [activeSelection, setActiveSelection] = useState(TABS[0]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  

  // useEffect(() => {
  //   if (activeSelection === 'Investigation') {
  //     fetchPatientFiles();
  //   }
  // }, [activeSelection]);

  // const fetchPatientFiles = async () => {
  //   try {
  //     setLoadingFiles(true);
  //     const res = await axios.post(
  //       `${API_URL}/api/patients/get-patient-image-files-list`,
  //       { patient_id: data.patient_id }
  //     );
  //     setFileList(res.data.data || []);
  //   } catch (err) {
  //     console.error('Error fetching patient files:', err);
  //   } finally {
  //     setLoadingFiles(false);
  //   }
  // };
  


  const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/files/upload-file",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrl = res.data.url;
      onDataChange({ [key]: uploadedUrl });

      // Store filename for UI
      setUploadedFiles((prev) => ({ ...prev, [key]: file.name }));

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <>
      <nav className="sub-heading-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSelection(tab)}
            className={`sub-heading-tab ${activeSelection === tab ? 'sub-heading-tab--active' : ''
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeSelection === 'Special Test' && (
        <div className="data-field-row">
          <div className="data-field data-field-1">
            <label htmlFor="Desciption">Description</label>
            <textarea
              name="special_test_desc"
              value={data.special_test_desc}
              onChange={(e) =>
                onDataChange({ special_test_desc: e.target.value })
              }
              placeholder="Enter subjective description"
            />
          </div>
        </div>
      )}

      {activeSelection === 'Investigation' && (
        <>
          <div className="data-field-row">


            <div className="data-field data-field-2">
              <label htmlFor="Desciption">X-Ray</label>
              <textarea
                name="xray_desc"
                value={data.xray_desc}
                onChange={(e) =>
                  onDataChange({ xray_desc: e.target.value })
                }
                placeholder="Description"
              />

              <label htmlFor="xray-upload" className="image-upload-button">
                <FaUpload /> Upload
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="xray-upload"
                onChange={(e) => handleFileUpload(e, "xray_file")}
              />
              
              {uploadedFiles.xray_file && (
                <span className="uploaded-file-name">{uploadedFiles.xray_file}</span>
              )}
            </div>


            <div className="data-field data-field-2">
              <label htmlFor="Desciption">MRI</label>
              <textarea
                name="mri_desc"
                value={data.mri_desc}
                onChange={(e) =>
                  onDataChange({ mri_desc: e.target.value })
                }
                placeholder="Description"
              />
              <input
                type="file"
                style={{ display: "none" }}
                id="mri-upload"
                onChange={(e) => handleFileUpload(e, "mri_file")}
              />
              <label htmlFor="mri-upload" className="image-upload-button">
                <FaUpload /> Upload
              </label>
              {uploadedFiles.mri_file && (
                <span className="uploaded-file-name">{uploadedFiles.mri_file}</span>
              )}
            </div>
          </div>

          
          
          
          

          
         
          <div className="data-field-row">
            <div className="data-field data-field-2">
              <label htmlFor="Desciption">Ultrasound</label>
              <textarea
                name="Description"
                value={data.ultrasound_desc}
                onChange={(e) =>
                  onDataChange({ ultrasound_desc: e.target.value })
                }
                placeholder="Description"
              />
              <input
                type="file"
                style={{ display: "none" }}
                id="ultrasound-upload"
                onChange={(e) => handleFileUpload(e, "ultrasound_file")}
              />
              <label htmlFor="ultrasound-upload" className="image-upload-button">
                <FaUpload /> Upload
              </label>
              {uploadedFiles.ultrasound_file && (
                <span className="uploaded-file-name">{uploadedFiles.ultrasound_file}</span>
              )}
            </div>

            <div className="data-field data-field-2">
              <label htmlFor="Desciption">Blood Report</label>
              <textarea
                name="Description"
                value={data.blood_report_desc}
                onChange={(e) =>
                  onDataChange({ blood_report_desc: e.target.value })
                }
                placeholder="Description"
              />
              <input
                type="file"
                style={{ display: "none" }}
                id="blood-report-upload"
                onChange={(e) => handleFileUpload(e, "blood_report_file")}
              />
              <label htmlFor="blood-report-upload" className="image-upload-button">
                <FaUpload /> Upload
              </label>
              {uploadedFiles.blood_report_file && (
                <span className="uploaded-file-name">{uploadedFiles.blood_report_file}</span>
              )}
            </div>

            
          </div>

        </>
      )}
    </>
  );
}

export default DifferentialDiagnosis;
