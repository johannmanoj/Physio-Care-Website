import React from 'react';
import './Sidebar.css'; // For sidebar specific styles
import { Link } from 'react-router-dom';
import image from '../assets/clinic-logo.png'


function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={image} alt="logo"/>
        {/* <span>Cricket Clinic</span> */}
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <i className="icon-dashboard"></i> 
          <Link to="/">Dashboard</Link>
        </li>
        <li className="menu-item">
          <i className="icon-players"></i>
          <Link to="/appointments">Appointments</Link>
        </li>
        {/* <li className="menu-item">
          <i className="icon-teams"></i>
          <Link to="/teams">Assessments</Link>
        </li> */}
        <li className="menu-item">
          <i className="icon-teams"></i>
          <Link to="/patientsList">Patients</Link>
        </li>
        {/* <li className="menu-item">
          <i className="icon-teams"></i>
          <Link to="/teams">Treatments</Link>
        </li> */}
        <li className="menu-item">
          <i className="icon-teams"></i>
          <Link to="/billing">Billing</Link>
        </li>
        <li className="menu-item">
          <i className="icon-teams"></i>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

// import React from 'react';
// import './Sidebar.css';
// import { Link } from 'react-router-dom';

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <span>Cricket Clinic</span>
//       </div>
//       <ul className="sidebar-menu">
//         <li className="menu-item"><Link to="/">Dashboard</Link></li>
//         <li className="menu-item"><Link to="/players">Players</Link></li>
//         <li className="menu-item"><Link to="/teams">Teams</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;