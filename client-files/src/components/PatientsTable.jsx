import React from 'react';
import './PatientsTable.css'; // For table specific styles
import { useNavigate } from "react-router-dom";


function PatientsTable({ players }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="patients-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Contact Number</th>
            <th>Last Visit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.patient_id}</td>
              <td>{player.name}</td>
              <td>{player.gender}</td>
              <td>{player.age}</td>
              <td>{player.contact_number}</td>
              <td>{player.last_visit}</td>
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

export default PatientsTable;