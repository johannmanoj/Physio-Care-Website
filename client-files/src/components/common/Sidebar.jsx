import React from 'react';
import { FaRegCalendarCheck, FaUserInjured, FaUserCircle, FaUsers, FaFileInvoice, FaChartBar, FaBookOpen, FaSitemap } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useAuth } from "../../context/AuthContext";
import { NavLink } from 'react-router-dom';   

import image from '../../assets/clinic-logo.png';
import company_image from '../../assets/palaestra-logo.png';
import './Sidebar.css';

function Sidebar() {
  const { role } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <MdDashboard style={{ color: "grey", fontSize: "24px" }} /> },
    { label: "Appointments", path: "/appointments", icon: <FaRegCalendarCheck style={{ color: "grey", fontSize: "24px" }} /> },
    { label: "Patients", path: "/patientsPage", icon: <FaUserInjured style={{ color: "grey", fontSize: "24px" }} /> },
    { label: "Invoices", path: "/invoiceTablePage", icon: <FaFileInvoice style={{ color: "grey", fontSize: "24px" }} /> },
    { label: "Users", path: "/usersListPage", icon: <FaUsers style={{ color: "grey", fontSize: "24px" }} />, roles: ["Admin"] },
    { label: "Reports", path: "/reports", icon: <FaChartBar style={{ color: "grey", fontSize: "24px" }} />, roles: ["Admin"] },
    { label: "Library", path: "/librariesPage", icon: <FaBookOpen style={{ color: "grey", fontSize: "24px" }} />, roles: ["Admin"] },
    { label: "Branches", path: "/branches", icon: <FaSitemap style={{ color: "grey", fontSize: "24px" }} />, roles: ["PrimaryAdmin"] },
    { label: "Profile", path: "/profile", icon: <FaUserCircle style={{ color: "grey", fontSize: "24px" }} /> },
  ];

  const filteredMenu = role === "PrimaryAdmin"
    ? menuItems.filter(item => item.label === "Branches" || item.label === "Profile")
    : menuItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={company_image} alt="logo" />
      </div>
      <ul className="sidebar-menu">
        {filteredMenu.map((item, idx) => (
          <li className="sidebar-menu-item" key={idx}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}  // 👈 Apply active class
            >
              {item.icon}
              <span className="menu-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
