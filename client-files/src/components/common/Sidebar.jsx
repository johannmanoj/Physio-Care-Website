import React from 'react';
import './Sidebar.css'; // For sidebar specific styles
import { Link } from 'react-router-dom';
import image from '../../assets/clinic-logo.png'

import { FaRegCalendarCheck, FaUserInjured, FaUserCircle } from 'react-icons/fa';
import { MdDashboard, MdRequestQuote } from 'react-icons/md';


function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={image} alt="logo" />
      </div>
      <ul className="sidebar-menu">

        <li className="menu-item">
          <MdDashboard style={{ color: 'grey', fontSize: '24px' }} />
          <Link to="/">Dashboard</Link>
        </li>

        <li className="menu-item">
          <FaRegCalendarCheck style={{ color: 'grey', fontSize: '24px' }} />
          <Link to="/appointments">Appointments</Link>
        </li>

        <li className="menu-item">
          <FaUserInjured style={{ color: 'grey', fontSize: '24px' }} />
          <Link to="/patientsPage">Patients</Link>
        </li>

        <li className="menu-item">
          <MdRequestQuote style={{ color: 'grey', fontSize: '24px' }} />
          <Link to="/billing">Billing</Link>
        </li>

        <li className="menu-item">
          <FaUserCircle style={{ color: 'grey', fontSize: '24px' }} />
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;