import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



function DashboardPage() {
  const [patientData, setPatientData] = useState([]);
  
  useEffect(() => {
    axios.post('http://localhost:3000/api/players/get-players-list')
      .then((response) => {
        setPatientData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching players data:', error);
      });
  }, []);

  const navigate = useNavigate();
  

  return (
    <div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Appointments</div> 
            <div className='dashboard-card-header-link' onClick={() => navigate("/appointments")}>More..</div>
          </div>
          <table className='db-appointment-table'>
            <thead>
              <tr>
                <th>Appt No</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              
              {patientData.slice(0, 5).map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.appointment_id}</td>
                  <td>{patient.patient_name}</td>
                  <td>{patient.date}</td>
                  <td>{patient.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Patients</div>
          <div></div>
        </div>
      </div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Assessments</div>
          <div></div>
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Treatments</div>
          <div></div>
        </div>
      </div>
      
      
      
    </div>
  );
}

export default DashboardPage;

