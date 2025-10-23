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
  const [treatmentData, setTreatmentData] = useState([])
  const [exerciseData, serExerciseData] = useState([])
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

  useEffect(() => {
    axios.post(`${API_URL}/api/exercises/get-treatments-list`)
      .then((response) => {
        setTreatmentData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);

  useEffect(() => {
    axios.post(`${API_URL}/api/exercises/get-exercise-list`)
      .then((response) => {
        serExerciseData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);


  return (
    <div className='dashboard-layout'>
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
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "50px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Appt No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>

                {appointmentData.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patient_id}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.session_type}</td>
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
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "170px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "50px" }} />
              </colgroup>
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
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Treatments</div>
            <button className='dashboard-card-button' onClick={() => navigate("/patientsPage")}>View All</button>
          </div>
          {patientData.length > 0 && (
            <table className='db-appointment-table'>
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "50px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th> Treatment ID</th>
                  <th>Treatment</th>
                  <th>Cost / hr</th>
                </tr>
              </thead>
              <tbody>
                {treatmentData.slice(0, 5).map((treatment) => (
                  <tr key={treatment.id}>
                    <td>{treatment.id}</td>
                    <td>{treatment.treatment}</td>
                    <td>{treatment.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {treatmentData.length == 0 && (
            <div className='dashboard-card-default-text'>
              <div>No Treatments Yet</div>
            </div>
          )}
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Exercises</div>
            <button className='dashboard-card-button' onClick={() => navigate("/exerciseLibPage")}>View All</button>
          </div>
          {exerciseData.length > 0 && (
            <table className='db-appointment-table'>
              <colgroup>
                <col style={{ width: "20px" }} />
                <col style={{ width: "200px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Exercise ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {exerciseData.slice(0, 5).map((exercise) => (
                  <tr key={exercise.id}>
                    <td>{exercise.id}</td>
                    <td>{exercise.name}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {treatmentData.length == 0 && (
            <div className='dashboard-card-default-text'>
              <div>No Treatments Yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

