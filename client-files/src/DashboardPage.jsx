import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import prof_image from './assets/clinic-logo.png'

import { FaRegCalendarCheck, FaStethoscope  } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb'
import { BiTimeFive } from 'react-icons/bi'



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

        <div className='dashboard-card-single'>

          <div className='dashboard-stats'>
            <FaRegCalendarCheck style={{ color: 'grey', fontSize: '34px' }} />
            <div className='dashboard-stats-set'>
              <div className='dashboard-stats-header'>Today’s Appointments</div>  
              <div>50</div>  
            </div>
          </div>

          <div className='dashboard-stats'>
            <FaStethoscope style={{ color: 'grey', fontSize: '34px' }} />
            <div className='dashboard-stats-set'>
              <div className='dashboard-stats-header'>Pending Treatments</div>  
              <div>60</div>  
            </div>
          </div>

          <div className='dashboard-stats'>
            <TbListDetails style={{ color: 'grey', fontSize: '34px' }} />
            <div className='dashboard-stats-set'>
              <div className='dashboard-stats-header'>Completed Sessions</div>  
              <div>25</div>  
            </div>
          </div>

          <div className='dashboard-stats'>
            <BiTimeFive style={{ color: 'grey', fontSize: '34px' }} />
            <div className='dashboard-stats-set'>
              <div className='dashboard-stats-header'>Sessions Time</div>  
              <div>60</div>  
            </div>
          </div>
          
        </div>
      </div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Appointments</div> 
            {/* <div className='dashboard-card-header-link' onClick={() => navigate("/appointments")}>More..</div> */}
            <button className='dashboard-card-button' onClick={() => navigate("/appointments")}>View All</button>
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
          <div className='dashboard-card-default-text'>No patients to display</div>
        </div>
      </div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Assessments</div>
          <div className='dashboard-card-default-text'>No assessments to display</div>
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Treatments</div>
          <div className='dashboard-card-default-text'>No treatments to display</div>
        </div>
      </div>
      
      
      
    </div>
  );
}

export default DashboardPage;

