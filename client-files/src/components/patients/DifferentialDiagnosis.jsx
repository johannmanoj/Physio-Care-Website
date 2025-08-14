import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DicomViewer from './DicomViewer'; // Make sure this file exists
const API_URL = import.meta.env.VITE_API_URL

function DifferentialDiagnosis({ data, onDataChange }) {
  const TABS = ['Special Test', 'Investigation'];
  const [activeSelection, setActiveSelection] = useState(TABS[0]);
  const [fileList, setFileList] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // State for file to view
  const [selectedDicomUrl, setSelectedDicomUrl] = useState(null);
  const [selectedAnnotations, setSelectedAnnotations] = useState(null);

  useEffect(() => {
    if (activeSelection === 'Investigation') {
      fetchPatientFiles();
    }
  }, [activeSelection]);

  const fetchPatientFiles = async () => {
    try {
      setLoadingFiles(true);
      const res = await axios.post(
        `${API_URL}/api/patients/get-patient-image-files-list`,
        { patient_id: data.patient_id }
      );
      setFileList(res.data.data || []);
    } catch (err) {
      console.error('Error fetching patient files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleViewFile = (file) => {
    setSelectedDicomUrl(file.original_file);
    try {
      const parsedAnnotations = file.annotations
        ? JSON.parse(file.annotations)
        : null;
      setSelectedAnnotations(parsedAnnotations);
    } catch (err) {
      console.error('Invalid annotation JSON:', err);
      setSelectedAnnotations(null);
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
          {/* Always show DicomViewer with upload option */}
          <DicomViewer
            dicomUrl={selectedDicomUrl}
            initialAnnotations={selectedAnnotations}
            data={data}
            onDataChange={onDataChange}
          />


          

          {/* Uploaded files list */}
          {/* <h3 className="mt-4">Previously Uploaded Files</h3>
          {loadingFiles ? (
            <p>Loading files...</p>
          ) : (
            <table className="uploaded-files-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>File</th>
                  <th>Classification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fileList.length > 0 ? (
                  fileList.map((file) => (
                    <tr key={file.id}>
                      <td>{file.id}</td>
                      <td>{file.original_file.split('/').pop()}</td>
                      <td>{file.classification}</td>
                      <td>
                        <button onClick={() => handleViewFile(file)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No files uploaded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )} */}


        </>
      )}
    </>
  );
}

export default DifferentialDiagnosis;
