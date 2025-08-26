import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaStethoscope } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb'
import { BiTimeFive } from 'react-icons/bi'
import { useAuth } from "../context/AuthContext";


const API_URL = import.meta.env.VITE_API_URL





function DashboardPage() {
  const navigate = useNavigate();

  // const appointmentData = [
  //   {
  //     id: 1,
  //     appointment_id: 'APT-1001',
  //     patient_name: 'Rahul Sharma',
  //     patient_id: 'P1001',
  //     date: '2025-06-28',
  //     time: '13:30:00',
  //     session_type: 'Follow-up',
  //     status: 'Completed'
  //   },
  //   {
  //     id: 2,
  //     appointment_id: 'APT-1002',
  //     patient_name: 'Sneha Iyer',
  //     patient_id: 'P1002',
  //     date: '2025-07-05',
  //     time: '09:30:00',
  //     session_type: 'Treatment',
  //     status: 'Completed'
  //   },
  //   {
  //     id: 3,
  //     appointment_id: 'APT-1003',
  //     patient_name: 'Arjun Patel',
  //     patient_id: 'P1003',
  //     date: '2025-07-09',
  //     time: '15:00:00',
  //     session_type: 'Assessment',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 4,
  //     appointment_id: 'APT-1004',
  //     patient_name: 'Priya Nair',
  //     patient_id: 'P1004',
  //     date: '2025-06-24',
  //     time: '14:30:00',
  //     session_type: 'IPS Screening',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 5,
  //     appointment_id: 'APT-1005',
  //     patient_name: 'Vikram Singh',
  //     patient_id: 'P1005',
  //     date: '2025-07-09',
  //     time: '17:00:00',
  //     session_type: 'IPS Screening',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 6,
  //     appointment_id: 'APT-1006',
  //     patient_name: 'Kavita Rao',
  //     patient_id: 'P1006',
  //     date: '2025-06-27',
  //     time: '10:30:00',
  //     session_type: 'Assessment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 7,
  //     appointment_id: 'APT-1007',
  //     patient_name: 'Rohan Mehta',
  //     patient_id: 'P1007',
  //     date: '2025-07-01',
  //     time: '15:00:00',
  //     session_type: 'Assessment',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 8,
  //     appointment_id: 'APT-1008',
  //     patient_name: 'Anita Das',
  //     patient_id: 'P1008',
  //     date: '2025-07-07',
  //     time: '14:30:00',
  //     session_type: 'IPS Screening',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 9,
  //     appointment_id: 'APT-1009',
  //     patient_name: 'Siddharth Gupta',
  //     patient_id: 'P1009',
  //     date: '2025-06-25',
  //     time: '14:00:00',
  //     session_type: 'Follow-up',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 10,
  //     appointment_id: 'APT-1010',
  //     patient_name: 'Neha Kapoor',
  //     patient_id: 'P1010',
  //     date: '2025-07-04',
  //     time: '10:00:00',
  //     session_type: 'Treatment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 11,
  //     appointment_id: 'APT-1011',
  //     patient_name: 'Amitabh Reddy',
  //     patient_id: 'P1011',
  //     date: '2025-06-24',
  //     time: '17:30:00',
  //     session_type: 'IPS Screening',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 12,
  //     appointment_id: 'APT-1012',
  //     patient_name: 'Pooja Chauhan',
  //     patient_id: 'P1012',
  //     date: '2025-07-01',
  //     time: '12:30:00',
  //     session_type: 'Assessment',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 13,
  //     appointment_id: 'APT-1013',
  //     patient_name: 'Karan Malhotra',
  //     patient_id: 'P1013',
  //     date: '2025-06-28',
  //     time: '10:00:00',
  //     session_type: 'Treatment',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 14,
  //     appointment_id: 'APT-1014',
  //     patient_name: 'Divya Joshi',
  //     patient_id: 'P1014',
  //     date: '2025-07-09',
  //     time: '09:30:00',
  //     session_type: 'Treatment',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 15,
  //     appointment_id: 'APT-1015',
  //     patient_name: 'Manish Kumar',
  //     patient_id: 'P1015',
  //     date: '2025-07-04',
  //     time: '11:30:00',
  //     session_type: 'Follow-up',
  //     status: 'Completed'
  //   },
  //   {
  //     id: 16,
  //     appointment_id: 'APT-1016',
  //     patient_name: 'Anjali Menon',
  //     patient_id: 'P1016',
  //     date: '2025-06-24',
  //     time: '10:30:00',
  //     session_type: 'Assessment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 17,
  //     appointment_id: 'APT-1017',
  //     patient_name: 'Harsh Vardhan',
  //     patient_id: 'P1017',
  //     date: '2025-06-26',
  //     time: '12:00:00',
  //     session_type: 'Assessment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 18,
  //     appointment_id: 'APT-1018',
  //     patient_name: 'Simran Kaur',
  //     patient_id: 'P1018',
  //     date: '2025-07-02',
  //     time: '16:30:00',
  //     session_type: 'Assessment',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 19,
  //     appointment_id: 'APT-1019',
  //     patient_name: 'Girish Bhat',
  //     patient_id: 'P1019',
  //     date: '2025-07-01',
  //     time: '12:30:00',
  //     session_type: 'Assessment',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 20,
  //     appointment_id: 'APT-1020',
  //     patient_name: 'Ritu Jain',
  //     patient_id: 'P1020',
  //     date: '2025-07-06',
  //     time: '10:30:00',
  //     session_type: 'Follow-up',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 21,
  //     appointment_id: 'APT-1021',
  //     patient_name: 'Aditya Bhatt',
  //     patient_id: 'P1021',
  //     date: '2025-06-29',
  //     time: '15:00:00',
  //     session_type: 'Treatment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 22,
  //     appointment_id: 'APT-1022',
  //     patient_name: 'Meera Verma',
  //     patient_id: 'P1022',
  //     date: '2025-07-03',
  //     time: '12:00:00',
  //     session_type: 'IPS Screening',
  //     status: 'Cancelled'
  //   },
  //   {
  //     id: 23,
  //     appointment_id: 'APT-1023',
  //     patient_name: 'Suresh Pillai',
  //     patient_id: 'P1023',
  //     date: '2025-06-30',
  //     time: '14:30:00',
  //     session_type: 'Treatment',
  //     status: 'Rescheduled'
  //   },
  //   {
  //     id: 24,
  //     appointment_id: 'APT-1024',
  //     patient_name: 'Farah Khan',
  //     patient_id: 'P1024',
  //     date: '2025-07-06',
  //     time: '15:00:00',
  //     session_type: 'Treatment',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 25,
  //     appointment_id: 'APT-1025',
  //     patient_name: 'Raj Kumari',
  //     patient_id: 'P1025',
  //     date: '2025-07-07',
  //     time: '14:00:00',
  //     session_type: 'Assessment',
  //     status: 'Upcoming'
  //   }
  // ]

  const [appointmentData, setAppointmnetData] = useState([]);
  const [patientData, setPatientData] = useState([]);

  // useEffect(() => {
  //   axios.post(`${API_URL}/api/appointments/get-appointments-list`)
  //     .then((response) => {
  //       setAppointmnetData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching appointment data:', error);
  //     });
  // }, []);
  
  const { role, loginEmail, userId } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;

        if (role === "Admin") {
          // Admin → fetch all appointments
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`);
        } else {
          // Non-admin → fetch only practitioner's appointments
          response = await axios.post(`${API_URL}/api/appointments/get-practitioner-appointments-list`, {
            practitioner_id: userId,
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
    axios.post(`${API_URL}/api/patients/get-patient-list`)
      .then((response) => {
        setPatientData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);



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
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>
            <div className='dashboard-card-header-name'>Patients</div>
            <button className='dashboard-card-button' onClick={() => navigate("/patientsPage")}>View All</button>
          </div>
          <table className='db-appointment-table'>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patientData.slice(0, 5).map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.patient_name}</td>
                  <td>{patient.contact_num}</td>
                  <td>{patient.last_visit}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

