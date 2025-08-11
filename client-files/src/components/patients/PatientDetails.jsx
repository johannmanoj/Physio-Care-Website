import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './PatientDetails.css'

import DifferentialDiagnosis from './DifferentialDiagnosis';
import TreatmentGoal from './TreatmentGoal';
import DemographicData from './DemographicData';
import Physio from './Physio';

import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL

function PatientDetails(props) {
  const { patientId } = useParams();

  const [patientData, setPatientData] = React.useState({
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
    sketch_overlays: ''
  });
  

  useEffect(() => {
    axios.post(`${API_URL}/api/patients/get-patient-details`,{"patient_id":patientId})
      .then((response) => {
        if(response.data.data.length > 0){setPatientData(response.data.data[0])}
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
      const res = await axios.post(`${API_URL}/api/patients/update-patient`, patientData);
      console.log('Patient updated successfully:', res.data);
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  };

  const TABS = ['Demographic Data', 'Physio', 'Differential Diagnosis', 'Treatment Goals'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="patient-details-page">
      <div className='patient-details-page-card'>
        <header className="patient-header">
          <h1>Patient ID : {patientData.patient_id}</h1>
          <nav className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === 'Demographic Data' && 
          <DemographicData data={patientData} onDataChange={updatePatientData} />}
        {activeTab === 'Physio' && 
          <Physio data={patientData} onDataChange={updatePatientData} />}
        {activeTab === 'Differential Diagnosis' && <DifferentialDiagnosis />}
        {activeTab === 'Treatment Goals' && <TreatmentGoal />}

        <div className="patient-details-save">
          <button className='b-cancel'>Cancel</button>
          <button className='b-save'onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;