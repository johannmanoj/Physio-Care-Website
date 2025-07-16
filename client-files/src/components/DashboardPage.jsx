import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaStethoscope } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb'
import { BiTimeFive } from 'react-icons/bi'



function DashboardPage() {
  const navigate = useNavigate();

  const appointmentData = [
    {
      id: 1,
      appointment_id: 'APT-1001',
      patient_name: 'Rahul Sharma',
      patient_id: 'P1001',
      date: '2025-06-28',
      time: '13:30:00',
      session_type: 'Follow-up',
      status: 'Completed'
    },
    {
      id: 2,
      appointment_id: 'APT-1002',
      patient_name: 'Sneha Iyer',
      patient_id: 'P1002',
      date: '2025-07-05',
      time: '09:30:00',
      session_type: 'Treatment',
      status: 'Completed'
    },
    {
      id: 3,
      appointment_id: 'APT-1003',
      patient_name: 'Arjun Patel',
      patient_id: 'P1003',
      date: '2025-07-09',
      time: '15:00:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 4,
      appointment_id: 'APT-1004',
      patient_name: 'Priya Nair',
      patient_id: 'P1004',
      date: '2025-06-24',
      time: '14:30:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 5,
      appointment_id: 'APT-1005',
      patient_name: 'Vikram Singh',
      patient_id: 'P1005',
      date: '2025-07-09',
      time: '17:00:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 6,
      appointment_id: 'APT-1006',
      patient_name: 'Kavita Rao',
      patient_id: 'P1006',
      date: '2025-06-27',
      time: '10:30:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 7,
      appointment_id: 'APT-1007',
      patient_name: 'Rohan Mehta',
      patient_id: 'P1007',
      date: '2025-07-01',
      time: '15:00:00',
      session_type: 'Assessment',
      status: 'Cancelled'
    },
    {
      id: 8,
      appointment_id: 'APT-1008',
      patient_name: 'Anita Das',
      patient_id: 'P1008',
      date: '2025-07-07',
      time: '14:30:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 9,
      appointment_id: 'APT-1009',
      patient_name: 'Siddharth Gupta',
      patient_id: 'P1009',
      date: '2025-06-25',
      time: '14:00:00',
      session_type: 'Follow-up',
      status: 'Rescheduled'
    },
    {
      id: 10,
      appointment_id: 'APT-1010',
      patient_name: 'Neha Kapoor',
      patient_id: 'P1010',
      date: '2025-07-04',
      time: '10:00:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 11,
      appointment_id: 'APT-1011',
      patient_name: 'Amitabh Reddy',
      patient_id: 'P1011',
      date: '2025-06-24',
      time: '17:30:00',
      session_type: 'IPS Screening',
      status: 'Upcoming'
    },
    {
      id: 12,
      appointment_id: 'APT-1012',
      patient_name: 'Pooja Chauhan',
      patient_id: 'P1012',
      date: '2025-07-01',
      time: '12:30:00',
      session_type: 'Assessment',
      status: 'Cancelled'
    },
    {
      id: 13,
      appointment_id: 'APT-1013',
      patient_name: 'Karan Malhotra',
      patient_id: 'P1013',
      date: '2025-06-28',
      time: '10:00:00',
      session_type: 'Treatment',
      status: 'Upcoming'
    },
    {
      id: 14,
      appointment_id: 'APT-1014',
      patient_name: 'Divya Joshi',
      patient_id: 'P1014',
      date: '2025-07-09',
      time: '09:30:00',
      session_type: 'Treatment',
      status: 'Cancelled'
    },
    {
      id: 15,
      appointment_id: 'APT-1015',
      patient_name: 'Manish Kumar',
      patient_id: 'P1015',
      date: '2025-07-04',
      time: '11:30:00',
      session_type: 'Follow-up',
      status: 'Completed'
    },
    {
      id: 16,
      appointment_id: 'APT-1016',
      patient_name: 'Anjali Menon',
      patient_id: 'P1016',
      date: '2025-06-24',
      time: '10:30:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 17,
      appointment_id: 'APT-1017',
      patient_name: 'Harsh Vardhan',
      patient_id: 'P1017',
      date: '2025-06-26',
      time: '12:00:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 18,
      appointment_id: 'APT-1018',
      patient_name: 'Simran Kaur',
      patient_id: 'P1018',
      date: '2025-07-02',
      time: '16:30:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 19,
      appointment_id: 'APT-1019',
      patient_name: 'Girish Bhat',
      patient_id: 'P1019',
      date: '2025-07-01',
      time: '12:30:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 20,
      appointment_id: 'APT-1020',
      patient_name: 'Ritu Jain',
      patient_id: 'P1020',
      date: '2025-07-06',
      time: '10:30:00',
      session_type: 'Follow-up',
      status: 'Rescheduled'
    },
    {
      id: 21,
      appointment_id: 'APT-1021',
      patient_name: 'Aditya Bhatt',
      patient_id: 'P1021',
      date: '2025-06-29',
      time: '15:00:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 22,
      appointment_id: 'APT-1022',
      patient_name: 'Meera Verma',
      patient_id: 'P1022',
      date: '2025-07-03',
      time: '12:00:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 23,
      appointment_id: 'APT-1023',
      patient_name: 'Suresh Pillai',
      patient_id: 'P1023',
      date: '2025-06-30',
      time: '14:30:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 24,
      appointment_id: 'APT-1024',
      patient_name: 'Farah Khan',
      patient_id: 'P1024',
      date: '2025-07-06',
      time: '15:00:00',
      session_type: 'Treatment',
      status: 'Upcoming'
    },
    {
      id: 25,
      appointment_id: 'APT-1025',
      patient_name: 'Raj Kumari',
      patient_id: 'P1025',
      date: '2025-07-07',
      time: '14:00:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    }
  ]

  const patientData = [
    {
      id: 1,
      patient_id: 'P1001',
      name: 'Rahul Sharma',
      gender: 'Male',
      age: '29',
      contact_number: '9876543100',
      last_visit: '2025-06-28',
      status: 'Active'
    },
    {
      id: 2,
      patient_id: 'P1002',
      name: 'Sneha Iyer',
      gender: 'Female',
      age: '34',
      contact_number: '9876543101',
      last_visit: '2025-07-05',
      status: 'Active'
    },
    {
      id: 3,
      patient_id: 'P1003',
      name: 'Arjun Patel',
      gender: 'Male',
      age: '27',
      contact_number: '9876543102',
      last_visit: '2025-07-09',
      status: 'OnHold'
    },
    {
      id: 4,
      patient_id: 'P1004',
      name: 'Priya Nair',
      gender: 'Female',
      age: '31',
      contact_number: '9876543103',
      last_visit: '2025-06-24',
      status: 'Inactive'
    },
    {
      id: 5,
      patient_id: 'P1005',
      name: 'Vikram Singh',
      gender: 'Male',
      age: '42',
      contact_number: '9876543104',
      last_visit: '2025-07-09',
      status: 'Active'
    },
    {
      id: 6,
      patient_id: 'P1006',
      name: 'Kavya Menon',
      gender: 'Female',
      age: '25',
      contact_number: '9876543105',
      last_visit: '2025-06-30',
      status: 'Active'
    },
    {
      id: 7,
      patient_id: 'P1007',
      name: 'Rohit Desai',
      gender: 'Male',
      age: '33',
      contact_number: '9876543106',
      last_visit: '2025-07-02',
      status: 'Inactive'
    },
    {
      id: 8,
      patient_id: 'P1008',
      name: 'Ananya Rao',
      gender: 'Female',
      age: '28',
      contact_number: '9876543107',
      last_visit: '2025-07-03',
      status: 'Active'
    },
    {
      id: 9,
      patient_id: 'P1009',
      name: 'Siddharth Verma',
      gender: 'Male',
      age: '36',
      contact_number: '9876543108',
      last_visit: '2025-06-27',
      status: 'OnHold'
    },
    {
      id: 10,
      patient_id: 'P1010',
      name: 'Neha Joshi',
      gender: 'Female',
      age: '30',
      contact_number: '9876543109',
      last_visit: '2025-07-01',
      status: 'Active'
    },
    {
      id: 11,
      patient_id: 'P1011',
      name: 'Karan Kapoor',
      gender: 'Male',
      age: '40',
      contact_number: '9876543110',
      last_visit: '2025-06-29',
      status: 'Inactive'
    },
    {
      id: 12,
      patient_id: 'P1012',
      name: 'Aditi Mishra',
      gender: 'Female',
      age: '26',
      contact_number: '9876543111',
      last_visit: '2025-07-06',
      status: 'Active'
    },
    {
      id: 13,
      patient_id: 'P1013',
      name: 'Mohan Kumar',
      gender: 'Male',
      age: '48',
      contact_number: '9876543112',
      last_visit: '2025-06-23',
      status: 'Active'
    },
    {
      id: 14,
      patient_id: 'P1014',
      name: 'Riya Gupta',
      gender: 'Female',
      age: '22',
      contact_number: '9876543113',
      last_visit: '2025-07-07',
      status: 'OnHold'
    },
    {
      id: 15,
      patient_id: 'P1015',
      name: 'Deepak Reddy',
      gender: 'Male',
      age: '35',
      contact_number: '9876543114',
      last_visit: '2025-06-25',
      status: 'Active'
    },
    {
      id: 16,
      patient_id: 'P1016',
      name: 'Pooja Mehta',
      gender: 'Female',
      age: '32',
      contact_number: '9876543115',
      last_visit: '2025-06-26',
      status: 'Inactive'
    },
    {
      id: 17,
      patient_id: 'P1017',
      name: 'Ajay Bansal',
      gender: 'Male',
      age: '37',
      contact_number: '9876543116',
      last_visit: '2025-07-04',
      status: 'Active'
    },
    {
      id: 18,
      patient_id: 'P1018',
      name: 'Isha Shah',
      gender: 'Female',
      age: '29',
      contact_number: '9876543117',
      last_visit: '2025-07-08',
      status: 'Active'
    },
    {
      id: 19,
      patient_id: 'P1019',
      name: 'Manish Jain',
      gender: 'Male',
      age: '41',
      contact_number: '9876543118',
      last_visit: '2025-06-22',
      status: 'Inactive'
    },
    {
      id: 20,
      patient_id: 'P1020',
      name: 'Divya Kaur',
      gender: 'Female',
      age: '27',
      contact_number: '9876543119',
      last_visit: '2025-06-21',
      status: 'Active'
    },
    {
      id: 21,
      patient_id: 'P1021',
      name: 'Rakesh Das',
      gender: 'Male',
      age: '38',
      contact_number: '9876543120',
      last_visit: '2025-06-30',
      status: 'OnHold'
    },
    {
      id: 22,
      patient_id: 'P1022',
      name: 'Tanvi Kulkarni',
      gender: 'Female',
      age: '24',
      contact_number: '9876543121',
      last_visit: '2025-07-02',
      status: 'Active'
    },
    {
      id: 23,
      patient_id: 'P1023',
      name: 'Sandeep Yadav',
      gender: 'Male',
      age: '31',
      contact_number: '9876543122',
      last_visit: '2025-07-03',
      status: 'Inactive'
    },
    {
      id: 24,
      patient_id: 'P1024',
      name: 'Shreya Ghosh',
      gender: 'Female',
      age: '28',
      contact_number: '9876543123',
      last_visit: '2025-07-05',
      status: 'Active'
    },
    {
      id: 25,
      patient_id: 'P1025',
      name: 'Ashwin Pillai',
      gender: 'Male',
      age: '45',
      contact_number: '9876543124',
      last_visit: '2025-06-28',
      status: 'Active'
    }
  ]

  // const [appointmentData, setAppointmnetData] = useState([]);
  // const [patientData, setPatientData] = useState([]);

  // useEffect(() => {
  //   axios.post('http://localhost:3000/api/players/get-appointment-list')
  //     .then((response) => {
  //       setAppointmnetData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching appointment data:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios.post('http://localhost:3000/api/players/get-patient-list')
  //     .then((response) => {
  //       setPatientData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching patient data:', error);
  //     });
  // }, []);



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
                  <td>{appointment.appointment_id}</td>
                  <td>{appointment.patient_name}</td>
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
                  <td>{patient.patient_id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.contact_number}</td>
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

