import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../sidebarPages/DashboardPage';
import AppointmentsPage from '../sidebarPages/AppointmentsPage';
import ProfilePage from '../profile/ProfilePage';
import BillingPage from '../sidebarPages/BillingPage'
import PatientsPage from '../sidebarPages/PatientsPage';
import PatientDetails from '../patients/PatientDetails'
import UsersListPage from '../admin/UsersListPage'
import AppointmentDetails from '../appointments/AppointmentDetails'
import PatientAppointments from '../patients/PatientAppointments'
import AddAppointment from '../appointments/AddAppointment'
import InvoiceTablePage from '../invoice/InvoiceTablePage'
import UserPage from '../admin/UserPage'
import ReportsPage from '../reports/ReportsPage'
import AttendanceReportPage from '../reports/AttendanceReportPage'
import InvoiceReportPage from '../reports/InvoiceReportPage'
import AppointmentReportPage from '../reports/AppointmentReportPage'
import LibrariesPage from '../library/LibrariesPage'
import ExerciseLibPage from '../library/ExerciseLibPage'
import TreatmentLibPage from '../library/TreatmentLibPage'
import Branches from '../admin/Branches'

import { useAuth } from "../../context/AuthContext";


function App() {
  const { role } = useAuth();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes className="homepage-grid">
          
          <Route path="/" element={role == "PrimaryAdmin" ? <Branches/> : <DashboardPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/patientsPage" element={<PatientsPage />} />
          <Route path="/usersListPage" element={<UsersListPage />} />
          <Route path="/addAppointment" element={<AddAppointment />} />
          <Route path="/invoiceTablePage" element={<InvoiceTablePage />} />
          <Route path="/invoiceReportPage" element={<InvoiceReportPage />} />
          <Route path="/attendanceReports" element={<AttendanceReportPage />} />
          <Route path="/appointmentReportPage" element={<AppointmentReportPage />} />
          <Route path="/librariesPage" element={<LibrariesPage />} />
          <Route path="/exerciseLibPage" element={<ExerciseLibPage />} />
          <Route path="/treatmentLibPage" element={<TreatmentLibPage />} />
          <Route path="/branches" element={<Branches />} />

          <Route path="/patientAppointments/:patientId/:patientName" element={<PatientAppointments />} />
          <Route path="/appointmentDetails/:patientId/:apptId" element={<AppointmentDetails />} />
          <Route path="/patientInfo/:apptId" element={<PatientDetails />} />
          <Route path="/userPage/:employeeId" element={<UserPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;