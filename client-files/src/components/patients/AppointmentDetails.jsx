import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AppointmentDetails.css'

import DifferentialDiagnosis from './DifferentialDiagnosis';
import TreatmentGoal from './TreatmentGoal';
import DemographicData from './DemographicData';
import Physio from './Physio';

import { useParams } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // ✅ react-icons

const API_URL = import.meta.env.VITE_API_URL

function PatientDetails(props) {
  const { patientId } = useParams();

  const [patientData, setPatientData] = useState({
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
    goal_desc:'',
    program_desc:'',
    xray_desc:'',
    xray_file:'',
    mri_desc:'',
    mri_file:'',
    ultrasound_desc:'',
    ultrasound_file:'',
    blood_report_desc:'',
    blood_report_file:''
  });

  const [openSection, setOpenSection] = useState(null); // accordion state

  useEffect(() => {
    axios.post(`${API_URL}/api/patients/get-patient-details`,{"patient_id":patientId})
      .then((response) => {
        if(response.data.data.length > 0){setPatientData(response.data.data[0])}
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, [patientId]);

  const updatePatientData = (newData) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/appointments/update-appointment`, patientData);
      console.log('Patient updated successfully:', res.data);
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  };

  const sections = [
    { title: "Demographic Data", component: <DemographicData data={patientData} onDataChange={updatePatientData} /> },
    { title: "Physio", component: <Physio data={patientData} onDataChange={updatePatientData} /> },
    { title: "Differential Diagnosis", component: <DifferentialDiagnosis data={patientData} onDataChange={updatePatientData} /> },
    { title: "Treatment Goals", component: <TreatmentGoal data={patientData} onDataChange={updatePatientData} /> },
  ];

  return (
    <div className="patient-details-page">
      <div className="patient-details-page-card">
        <header className="patient-header">
          <h1>Patient ID : {patientData.patient_id}</h1>
        </header>

        <div className="accordion">
          {sections.map((section, index) => (
            <div key={section.title} className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setOpenSection(openSection === index ? null : index)}
              >
                <span>{section.title}</span>
                {openSection === index ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {openSection === index && (
                <div className="accordion-content">
                  {section.component}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="patient-details-save">
          <button className='b-cancel'>Cancel</button>
          <button className='b-save' onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;
