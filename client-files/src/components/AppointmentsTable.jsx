import React from 'react';
import './AppointmentsTable.css'; // For table specific styles
import { useNavigate } from "react-router-dom";


function AppointmentsTable({ players }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="player-table">
        <thead>
          <tr>
            <th>Appt ID</th>
            <th>Patient Names</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Session Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.appointment_id}</td>
              <td>{player.patient_name}</td>
              <td>{player.patient_id}</td>
              <td>{player.date}</td>
              <td>{player.time}</td>
              <td>{player.session_type}</td>
              <td>
                <span className={`status-badge ${player.status.toLowerCase()}`}>
                  {player.status}
                </span>
              </td>
              {/* <td className='appointment-status'>{player.status}</td> */}
              <td>
                <button className="view-button" onClick={() => navigate("/patientInfo")}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentsTable;