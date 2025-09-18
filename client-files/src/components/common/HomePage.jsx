import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import AppointmentsPage from '../AppointmentsPage';
import ProfilePage from '../profile/ProfilePage';
import BillingPage from '../BillingPage'
import PatientsPage from '../PatientsPage';
import PatientDetails from '../patients/PatientDetails'
import UsersListPage from '../admin/UsersListPage'
import AppointmentDetails from '../appointments/AppointmentDetails'
import PatientAppointments from '../patients/PatientAppointments'
// import AddAppointment from '../patients/AddAppointment'
import AddAppointment from '../appointments/AddAppointment'
import InvoiceTablePage from '../invoice/InvoiceTablePage'
import UserPage from '../admin/UserPage'
import ReportsPage from '../reports/ReportsPage'
import AttendanceReportPage from '../reports/AttendanceReportPage'
import InvoiceReportPage from '../reports/InvoiceReportPage'

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
          <Route path="/usersListPage" element={<UsersListPage />} />
          <Route path="/appointmentDetails/:patientId/:apptId" element={<AppointmentDetails />} />
          <Route path="/patientAppointments/:patientId/:patientName" element={<PatientAppointments />} />
          <Route path="/addAppointment" element={<AddAppointment />} />
          <Route path="/invoiceTablePage" element={<InvoiceTablePage />} />
          <Route path="/userPage/:employeeId" element={<UserPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/attendanceReports" element={<AttendanceReportPage />} />
          <Route path="/invoiceReportPage" element={<InvoiceReportPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;