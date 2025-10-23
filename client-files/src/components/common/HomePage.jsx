import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAuth } from "../../context/AuthContext";
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import '../cssCommon/PageCss.css';
import '../cssCommon/TableCss.css';
import '../cssCommon/ElementsCss.css';
import '../cssCommon/ModalCss.css';

import DashboardPage from '../sidebarPages/DashboardPage';
import AppointmentsPage from '../sidebarPages/AppointmentsPage';
import ProfilePage from '../profile/ProfilePage';
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

import InvoiceStats from '../reports/invoices/InvoiceStats'



function App() {
  const { role } = useAuth();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className='main-body-content'>
          <Routes className="homepage-grid">
            <Route path="/" element={role == "PrimaryAdmin" ? <Branches /> : <DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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
            <Route path="/invoiceStats/:employeeId" element={<InvoiceStats />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;