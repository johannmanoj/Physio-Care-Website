import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import AppointmentsPage from './AppointmentsPage';
import PatientList from './PatientListPage';
import ProfilePage from './ProfilePage';
import BillingPage from './BillingPage'
import PatientPage from './PatientPage';
import PatientsPage from './PatientsPage';
import PatientDetails from './patients/PatientDetails'
import SubjectiveDetails from './patients/SubjectiveDetails';
import ObjectiveDetails from './patients/ObjectiveDetails';

function App({}) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes className="testt">
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/patientsList" element={<PatientList />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/patientInfo" element={<PatientDetails />} />
          <Route path="/patientsPage" element={<PatientsPage />} />
          <Route path="/subjectiveDetails" element={<SubjectiveDetails />} />
          <Route path="/objectiveDetails" element={<ObjectiveDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;