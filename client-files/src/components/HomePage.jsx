import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './HomePage.css';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import PlayersPage from './PlayersPage';
import TeamsPage from './TeamsPage';
import ProfilePage from './ProfilePage';
import BillingPage from './BillingPage'
import { useState } from 'react';

function App({}) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes className="testt">
          <Route path="/" element={<DashboardPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;