import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUpload } from "react-icons/fa";
import './AppointmentDetails.css';
import PainAssessmentSketch from './PainAssessmentSketch'

import { Toaster, toast } from "react-hot-toast";



import body_icon from '../../assets/body-icon.png'

import SubmissionPopup from '../common/SubmissionPopup'

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
  xray_file: '',
  mri_desc: '',
  mri_file: '',
  ultrasound_desc: '',
  ultrasound_file: '',
  blood_report_desc: '',
  blood_report_file: ''
};

function PatientDetails() {
  const { patientId, apptId } = useParams();

  const [showSketchModal, setShowSketchModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(apptId || null);
  const [patientData, setPatientData] = useState(INITIAL_DATA);

  const [uploadedFiles, setUploadedFiles] = useState({});

  const [showSubmitModel, setShowSubmitModel] = useState(false)


  // --- fetch appointment list for the patient ---
  useEffect(() => {
    axios
      .post(`${API_URL}/api/appointments/get-patient-appointment-list`, { patient_id: patientId })
      .then((response) => {
        const list = response?.data?.data || [];
        setAppointments(list);

        // If nothing selected yet, fall back to URL apptId or first in list
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
    // keep apptId in deps so it re-syncs if route changes
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
      // include appt_id so backend knows what to update
      const payload = { ...patientData, appt_id: selectedApptId };
      const res = await axios.post(`${API_URL}/api/appointments/update-appointment`, payload);
      console.log('Patient updated successfully:', res.data);
      // setShowSubmitModel(true)
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
      updatePatientData({ [key]: uploadedUrl });

      // Store filename for UI
      setUploadedFiles((prev) => ({ ...prev, [key]: file.name }));

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


            {/* <input
              name="sex"
              value={patientData.sex ?? ''}
              onChange={(e) => updatePatientData({ sex: e.target.value })}
              placeholder="Sex"
            /> */}


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
              name="age"
              value={patientData.age ?? ''}
              onChange={(e) => updatePatientData({ age: e.target.value })}
              placeholder="Age"
            />
          </div>
          <div className="data-field data-field-4">
            <label htmlFor="contact">Contact Number</label>
            <input
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

        {/* If you want Update button here, uncomment:
        <div className="patient-details-save">
          <button className='b-save' onClick={handleSave}>Update</button>
        </div>
        */}
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

        {/* Appointment detail content */}
        <div className="appointment-details-sub-page-card">

          <h1>Appointment Details</h1>

          <div className='appointment-details-sub-heading'>
            <h2>Physio</h2>
          </div>

          <div className="data-field-row">
            <div className="appointment-field appointment-field-2">
              <label htmlFor="Subjective">Subjective</label>
              <textarea
                name="subjective_desc"
                value={patientData.subjective_desc ?? ''}
                onChange={(e) => updatePatientData({ subjective_desc: e.target.value })}
                placeholder="Enter subjective description"
              />
            </div>
            <div className="appointment-field appointment-field-2">
              <label htmlFor="Desciption">On Examination</label>
              <textarea
                name="onexamination_desc"
                value={patientData.onexamination_desc ?? ''}
                onChange={(e) => updatePatientData({ onexamination_desc: e.target.value })}
                placeholder="Enter on-examination description"
              />
            </div>
          </div>
          <div className='data-field-row'>
            <div className='data-field data-field-1'>

              <button className='appointment-pain-assessment-button' onClick={() => setShowSketchModal(true)}>
                <img className="appointment-pain-assessment-button-logo" src={body_icon} alt="" />
                Pain Assessment
              </button>

            </div>
          </div>

          <div className='appointment-details-sub-heading'>
            <h2>Differential Diagnosis</h2>
          </div>

          <div className="data-field-row">
            <div className="data-field data-field-1">
              <label htmlFor="Desciption">Special Test</label>
              <textarea
                name="special_test_desc"
                value={patientData.special_test_desc ?? ''}
                onChange={(e) => updatePatientData({ special_test_desc: e.target.value })}
                placeholder="Enter subjective description"
              />
            </div>
          </div>

          <div className="data-field-row">
            <div className="data-field data-field-1">
              <label htmlFor="Name">X-Ray</label>
              <textarea
                name="xray_desc"
                value={patientData.xray_desc ?? ''}
                onChange={(e) => updatePatientData({ xray_desc: e.target.value })}
                placeholder="Description"
              />
              <div className='image-upload-array'>
                <label htmlFor="xray-upload" className="upload-image-button">
                  <FaUpload /> Upload
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="xray-upload"
                  onChange={(e) => handleFileUpload(e, "xray_file")}
                />
                {/* <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button> */}
              </div>
            </div>
            <div className="data-field data-field-1">
              <label htmlFor="Desciption">MRI</label>
              <textarea
                name="mri_desc"
                value={patientData.mri_desc ?? ''}
                onChange={(e) => updatePatientData({ mri_desc: e.target.value })}
                placeholder="Description"
              />
              <div className='image-upload-array'>
                <label htmlFor="mri-upload" className="image-upload-button">
                  <FaUpload /> Upload
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="mri-upload"
                  onChange={(e) => handleFileUpload(e, "mri_file")}
                />

                {/* <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button> */}
              </div>
            </div>
          </div>

          <div className="data-field-row">
            <div className="data-field data-field-1">
              <label htmlFor="Desciption">Ultrasound</label>
              <textarea
                name="ultrasound_desc"
                value={patientData.ultrasound_desc ?? ''}
                onChange={(e) => updatePatientData({ ultrasound_desc: e.target.value })}
                placeholder="Description"
              />
              <div className='image-upload-array'>
                <label htmlFor="ultrasound-upload" className="image-upload-button">
                  <FaUpload /> Upload
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="ultrasound-upload"
                  onChange={(e) => handleFileUpload(e, "ultrasound_file")}
                />

                {/* <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button> */}
              </div>
            </div>
            <div className="data-field data-field-1">
              <label htmlFor="Desciption">Blood Report</label>
              <textarea
                name="blood_report_desc"
                value={patientData.blood_report_desc ?? ''}
                onChange={(e) => updatePatientData({ blood_report_desc: e.target.value })}
                placeholder="Description"
              />
              <div className='image-upload-array'>
                <label htmlFor="blood-report-upload" className="image-upload-button">
                  <FaUpload /> Upload
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="blood-report-upload"
                  onChange={(e) => handleFileUpload(e, "blood_report_file")}
                />

                {/* <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button>
                <button className='image-upload-button'><FaUpload /> Upload</button> */}
              </div>
            </div>
          </div>

          <div className='appointment-details-sub-heading'>
            <h2>Treatment Goals</h2>
          </div>

          <div className="data-field-row">
            <div className="data-field data-field-2">
              <label htmlFor="Goal">Goal</label>
              <textarea
                name="goal_desc"
                value={patientData.goal_desc ?? ''}
                onChange={(e) => updatePatientData({ goal_desc: e.target.value })}
                placeholder="Enter Goals description"
              />
            </div>
            <div className="data-field data-field-2">
              <label htmlFor="Program">Program</label>
              <textarea
                name="program_desc"
                value={patientData.program_desc ?? ''}
                onChange={(e) => updatePatientData({ program_desc: e.target.value })}
                placeholder="Enter program description"
              />
            </div>
          </div>

          <div className="patient-details-save">
            <button className='b-cancel'>Cancel</button>
            <button className='b-save' onClick={handleSave}>Save</button>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1e293b",   // dark navy/blue-gray
                  color: "#f8fafc",        // light text
                  border: "1px solid #334155",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",    // green success icon
                    secondary: "#1e293b",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",    // red error icon
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
              <button className="cancel-button" onClick={() => setShowSketchModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* {showSubmitModel && (
        <div className="appointment-modal-overlay">
          <div >

            <SubmissionPopup type="success" message="Details Updated" onClose = {setShowSubmitModel}/>
          </div>
        </div>
      )} */}



    </div>
  );
}

export default PatientDetails;
