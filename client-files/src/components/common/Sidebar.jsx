import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import image from '../../assets/clinic-logo.png';
import { useAuth } from "../../context/AuthContext";

import { FaRegCalendarCheck, FaUserInjured, FaUserCircle, FaUsers, FaFileInvoice, FaChartBar, FaBookOpen, FaSitemap } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

function Sidebar() {
  const { role } = useAuth();

  // Define menu items
  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: <MdDashboard style={{ color: "grey", fontSize: "24px" }} />,
    },
    {
      label: "Appointments",
      path: "/appointments",
      icon: <FaRegCalendarCheck style={{ color: "grey", fontSize: "24px" }} />,
    },
    {
      label: "Patients",
      path: "/patientsPage",
      icon: <FaUserInjured style={{ color: "grey", fontSize: "24px" }} />,
    },
    {
      label: "Invoices",
      path: "/invoiceTablePage",
      icon: <FaFileInvoice style={{ color: "grey", fontSize: "24px" }} />,
    },
    {
      label: "Users",
      path: "/usersListPage",
      icon: <FaUsers style={{ color: "grey", fontSize: "24px" }} />,
      roles: ["Admin"], // Only Admin
    },
    {
      label: "Reports",
      path: "/reports",
      icon: <FaChartBar style={{ color: "grey", fontSize: "24px" }} />,
      roles: ["Admin"], // Only Admin
    },
    {
      label: "Library",
      path: "/librariesPage",
      icon: <FaBookOpen style={{ color: "grey", fontSize: "24px" }} />,
      roles: ["Admin"], // Only Admin
    },
    {
      label: "Branches",
      path: "/branches",
      icon: <FaSitemap style={{ color: "grey", fontSize: "24px" }} />,
      roles: ["PrimaryAdmin"], // 👈 Only PrimaryAdmin
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <FaUserCircle style={{ color: "grey", fontSize: "24px" }} />,
    },
  ];

  // Special rule: If role is PrimaryAdmin → show only Branches & Profile
  const filteredMenu = role === "PrimaryAdmin"
    ? menuItems.filter(item => item.label === "Branches" || item.label === "Profile")
    : menuItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={image} alt="logo" />
      </div>
      <ul className="sidebar-menu">
        {filteredMenu.map((item, idx) => (
          <li className="menu-item" key={idx}>
            {item.icon}
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
