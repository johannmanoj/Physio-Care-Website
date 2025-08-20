import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import AppointmentsPage from '../AppointmentsPage';
import ProfilePage from '../ProfilePage';
import BillingPage from '../BillingPage'
import PatientsPage from '../PatientsPage';
import PatientDetails from '../patients/PatientDetails'
import UsersProfile from '../admin/UsersProfile'
import AppointmentDetails from '../patients/AppointmentDetails'
import PatientAppointments from '../patients/PatientAppointments'
import AddAppointment from '../patients/AddAppointment'

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes className="testt">
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/patientInfo/:apptId" element={<PatientDetails />} />
          {/* <Route path="/patientInfo" element={<PatientDetails />} /> */}
          <Route path="/patientsPage" element={<PatientsPage />} />
          <Route path="/usersProfile" element={<UsersProfile />} />
          <Route path="/appointmentDetails" element={<AppointmentDetails />} />
          <Route path="/patientAppointments/:patientId/:patientName" element={<PatientAppointments />} />
          <Route path="/addAppointment" element={<AddAppointment />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;