import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';

import './AppointmentDetails.css';
import PainAssessmentSketch from '../patients/PainAssessmentSketch'

import PhysioSection from './therapistSections/PhysioSection'
import TreatmentGoalsSection from './therapistSections/TreatmentGoalsSection'
import DifferentialDiagnosisSection from './therapistSections/DifferentialDiagnosisSection'

import PatientDetailsSection from './apptSubSections/PatientDetailsSection'
import ApptPaymentSection from './apptSubSections/ApptPaymentSection'

import TrainerAptSection from './trainerSections/TrainerAptSection'
import InvoiceModal from './apptSubSections/InvoiceModal'

const API_URL = import.meta.env.VITE_API_URL;


const INITIAL_DATA = {
  id: '',
  patient_id: '',
  name: '',
  status: '',
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
  blood_report_file: '',
  pymt_status: '',
  pymt_method: ''
};

function PatientDetails() {
  const { patientId, apptId } = useParams();
  const { role, userId, branchId } = useAuth();
  const isReadOnly = role === "Receptionist";

  const [showSketchModal, setShowSketchModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(apptId || null);
  const [patientData, setPatientData] = useState(INITIAL_DATA);



  // --- fetch appointment list for the patient ---
  useEffect(() => {
    axios
      .post(`${API_URL}/api/appointments/get-appointments-list`, { practitioner_id: userId, patient_id: patientId, branch_id: branchId })
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


  return (
    <div className="appointment-details-page">

      <div className='appointment-details-page-card'>
        <PatientDetailsSection />
      </div>

      <div className='appointments-page-split-layout'>

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
          <div className='common-page-header'>
            <h1>Appointment Details : {patientData.id}</h1>
            <select
              className='status-dropdown-section'
              id="role"
              value={patientData.status}
              onChange={(e) => updatePatientData({ status: e.target.value })}
            >
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          {patientData.session_type != "Trainer" && (
            <div>
              <PhysioSection
                patientData={patientData}
                updatePatientData={updatePatientData}
                setShowSketchModal={setShowSketchModal}
                isReadOnly={isReadOnly}
              />

              <DifferentialDiagnosisSection
                patientData={patientData}
                updatePatientData={updatePatientData}
                isReadOnly={isReadOnly}
              />

              <TreatmentGoalsSection
                patientData={patientData}
                updatePatientData={updatePatientData}
                isReadOnly={isReadOnly}
              />
              <ApptPaymentSection
                patientData={patientData}
                updatePatientData={updatePatientData}
                isReadOnly={isReadOnly}
              />
            </div>
          )}

          {patientData.session_type == "Trainer" && (
            <div>
              <div>
                <TrainerAptSection patient_id={patientId} appointment_id={apptId} />
              </div>
              <div>
                <ApptPaymentSection
                  patientData={patientData}
                  updatePatientData={updatePatientData}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>
          )}



          <div className="common-page-footer-layout">
            <button className='common-footer-bsave' onClick={handleSave} disabled={isReadOnly}>Save</button>
          </div>

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

      {showSketchModal && (
        <div className="common-modal-overlay">
          <div className="common-large-modal-content">
            <div className="common-modal-header">
              <h2 style={{ marginLeft: '20px' }}>Pain Assessment</h2>
            </div>


            <div className="common-modal-body">
              {/* <div className="appointment-modal-content"> */}
              <PainAssessmentSketch data={patientData} onDataChange={updatePatientData} setShowSketchModal={setShowSketchModal} />
              {/* <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setShowSketchModal(false)} disabled={isReadOnly}>Cancel</button>
              </div> */}
            </div>

          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="appointment-modal-overlay">
          <div className="appointment-modal-content">
            <InvoiceModal patientData={patientData} selectedApptId={selectedApptId} setShowInvoiceModal={setShowInvoiceModal} userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;