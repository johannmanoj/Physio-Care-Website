import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaStethoscope } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb'
import { BiTimeFive } from 'react-icons/bi'
import { useAuth } from "../../context/AuthContext";


const API_URL = import.meta.env.VITE_API_URL

function DashboardPage() {
  const navigate = useNavigate();

  const [appointmentData, setAppointmnetData] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const { role, userId, branchId } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;

        if (role === "Admin" || role === "Receptionist") {
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`, {
            branch_id: branchId
          });
        } else {
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`, {
            practitioner_id: userId,
            branch_id: branchId
          });
        }

        setAppointmnetData(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments data:", error);
      }
    };

    fetchAppointments();
  }, [role, userId]);

  useEffect(() => {
    axios.post(`${API_URL}/api/patients/get-patient-list`, {
      branch_id: branchId
    })
      .then((response) => {
        setPatientData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);


  return (
    <div>
      {/* <div className='dashboard-card-row'>
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
      </div> */}

      <div className='dashboard-card-row'>
        <div className='dashboard-card'>

          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Appointments</div>
            <button className='dashboard-card-button' onClick={() => navigate("/appointments")}>View All</button>
          </div>
          {appointmentData.length > 0 && (
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

                {appointmentData.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {appointmentData.length == 0 && (
            <div className='dashboard-card-default-text'>
              <div>No Appointments Yet</div>
            </div>
          )}
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Patients</div>
            <button className='dashboard-card-button' onClick={() => navigate("/patientsPage")}>View All</button>
          </div>
          {patientData.length > 0 && (
            <table className='db-appointment-table'>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {patientData.slice(0, 5).map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.patient_name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.contact_num}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {patientData.length == 0 && (
            <div className='dashboard-card-default-text'>
              <div>No Patients Yet</div>
            </div>
          )}
        </div>
      </div>

      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Assessments</div>

          <div className='dashboard-card-default-text'>
            <div>No assessments Yet</div>
          </div>

        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Treatments</div>
          <div className='dashboard-card-default-text'>No treatments Yet</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

