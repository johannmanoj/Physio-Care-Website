import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import { FaUpload, FaEye, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import './AppointmentDetails.css';
import PainAssessmentSketch from './PainAssessmentSketch'
import body_icon from '../../assets/body-icon.png'

const API_URL = import.meta.env.VITE_API_URL;


const INITIAL_DATA = {
  patient_id: '',
  name: '',
  age: '',
  sex: '',
  occupation: '',
  contact_num: '',
  medical_allergies: '',
  address: '',
  other_ailments: '',
  subjective_desc: '',
  onexamination_desc: '',
  sketch_overlays: '',
  special_test_desc: '',
  goal_desc: '',
  program_desc: '',
  xray_desc: '',
  mri_desc: '',
  ultrasound_desc: '',
  blood_report_desc: '',
  xray_file_1: '',
  xray_file_2: '',
  xray_file_3: '',
  xray_file_4: '',
  mri_file_1: '',
  mri_file_2: '',
  mri_file_3: '',
  mri_file_4: '',
  ultrasound_file_1: '',
  ultrasound_file_2: '',
  ultrasound_file_3: '',
  ultrasound_file_4: '',
  blood_report_file_1: '',
  blood_report_file_2: '',
  blood_report_file_3: '',
  blood_report_file_4: '',
  xray_file: '',
  mri_file: '',
  ultrasound_file: '',
  blood_report_file: ''
};

function PatientDetails() {
  const { patientId, apptId } = useParams();
  const { role, userId } = useAuth();
  const isReadOnly = role === "Receptionist";

  const [showSketchModal, setShowSketchModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(apptId || null);
  const [patientData, setPatientData] = useState(INITIAL_DATA);
  const [uploadedFiles, setUploadedFiles] = useState({});


  // --- fetch appointment list for the patient ---
  useEffect(() => {
    axios
      .post(`${API_URL}/api/appointments/get-practitioner-patient-appointments-list`, { practitioner_id: userId, patient_id: patientId })
      .then((response) => {
        const list = response?.data?.data || [];
        setAppointments(list);

        if (!selectedApptId) {
          const firstId = list.length
            ? (list[0].id ?? list[0].appt_id ?? list[0].appointment_id)
            : null;
          setSelectedApptId(apptId ?? firstId ?? null);
        }
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, [patientId, apptId]);

  // --- fetch details for the selected appointment ---
  useEffect(() => {
    if (!selectedApptId) return;
    axios
      .post(`${API_URL}/api/appointments/get-appointment-details`, { appt_id: selectedApptId })
      .then((response) => {
        const row = response?.data?.data?.[0];
        if (row) {
          setPatientData(prev => ({ ...prev, ...row }));
        } else {
          setPatientData(INITIAL_DATA);
        }
      })
      .catch((error) => {
        console.error('Error fetching appointment details:', error);
      });
  }, [selectedApptId]);

  const updatePatientData = (newData) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...patientData, appt_id: selectedApptId };
      await axios.post(`${API_URL}/api/appointments/update-appointment`, payload);
      toast.success("Details updated successfully!");
    } catch (err) {
      console.error('Error updating patient:', err);
      toast.error("Something went wrong!");
    }
  };

  const formatDayMonth = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '', month: '' };
    return {
      day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
      month: d.toLocaleDateString('en-GB', { month: 'short' }),
    };
  };

  const handleRemoveFile = (key) => {
    updatePatientData({ [key]: "" }); // clear the file URL
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


  // const handleFileUpload = async (event, key) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:3000/api/files/upload-file",
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     const uploadedUrl = res.data.url;
  //     updatePatientData({ [key]: uploadedUrl });

  //     // setUploadedFiles((prev) => ({ ...prev, [key]: file.name }));

  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //   }
  // };

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

    try {
      const res = await axios.post(
        "http://localhost:3000/api/files/upload-file",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrl = res.data.url;
      updatePatientData({ [key]: uploadedUrl });

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  return (
    <div className="appointment-details-page">
      {/* Top patient details card */}
      <div className='appointment-details-page-card'>
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

      {/* Split layout: left dates, right details */}
      <div className='appointments-page-split-layout'>
        {/* Dates sidebar */}
        <div className="appointments-page-dates">
          {appointments.map((appointment) => {
            const id = appointment.id ?? appointment.appt_id ?? appointment.appointment_id;
            const { day, month } = formatDayMonth(appointment.date);
            const isActive = String(selectedApptId) === String(id);
            return (
              <div
                key={id}
                className={`appointment-date-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedApptId(id)}
                role="button"
              >
                <div>{day}</div>
                <div>{month}</div>
              </div>
            );
          })}
        </div>

        <div className="appointment-details-sub-page-card">
          <h1>Appointment Details</h1>


          <h2 className='appointment-details-sub-heading'>Physio</h2>


          <div className="data-field-row">
            <div className="appointment-field appointment-field-2">
              <label htmlFor="Subjective">Subjective</label>
              <textarea
                name="subjective_desc"
                value={patientData.subjective_desc ?? ''}
                onChange={(e) => updatePatientData({ subjective_desc: e.target.value })}
                placeholder="Enter subjective description"
                disabled={isReadOnly}
              />
            </div>
            <div className="appointment-field appointment-field-2">
              <label htmlFor="Desciption">On Examination</label>
              <textarea
                name="onexamination_desc"
                value={patientData.onexamination_desc ?? ''}
                onChange={(e) => updatePatientData({ onexamination_desc: e.target.value })}
                placeholder="Enter on-examination description"
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div className='data-field-row'>
            <div className='data-field data-field-1'>
              <button
                className='appointment-pain-assessment-button'
                onClick={() => setShowSketchModal(true)}
                disabled={isReadOnly}
              >
                <img className="appointment-pain-assessment-button-logo" src={body_icon} alt="" />
                Pain Assessment
              </button>
            </div>
          </div>


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


          <h2 className='appointment-details-sub-heading'>Treatment Goals</h2>

          <div className="data-field-row">
            <div className="data-field data-field-2">
              <label>Goal</label>
              <textarea
                name="goal_desc"
                value={patientData.goal_desc ?? ''}
                onChange={(e) => updatePatientData({ goal_desc: e.target.value })}
                placeholder="Enter Goals description"
                disabled={isReadOnly}
              />
            </div>
            <div className="data-field data-field-2">
              <label>Program</label>
              <textarea
                name="program_desc"
                value={patientData.program_desc ?? ''}
                onChange={(e) => updatePatientData({ program_desc: e.target.value })}
                placeholder="Enter program description"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="patient-details-save">
            {/* <button className='b-cancel' disabled={isReadOnly}>Cancel</button> */}
            <button className='b-save' onClick={handleSave} disabled={isReadOnly}>Save</button>
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
        </div>
      </div>

      {showSketchModal && (
        <div className="appointment-modal-overlay">
          <div className="appointment-modal-content">
            <PainAssessmentSketch data={patientData} onDataChange={updatePatientData} />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setShowSketchModal(false)} disabled={isReadOnly}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;
