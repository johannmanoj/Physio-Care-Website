import React from 'react';
import './PatientsTable.css'; // For table specific styles
import { useNavigate } from "react-router-dom";


function PatientsTable({ patients }) {
  const navigate = useNavigate();

  console.log("patients",patients);
  

  return (
    <div className="table-wrapper">
      <table className="patients-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Sex</th>
            <th>Age</th>
            <th>Contact Number</th>
            <th>Last Visit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.patient_id}</td>
              <td>{patient.name}</td>
              <td>{patient.sex}</td>
              <td>{patient.age}</td>
              <td>{patient.contact_num}</td>
              <td></td>
              <td></td>
              {/* <td>{patient.last_visit}</td> */}
              {/* <td>
                <span className={`status-badge ${patient.status.toLowerCase()}`}>
                  {patient.status}
                </span>
              </td> */}
              <td>
                <button className="view-button" onClick={() => navigate(`/patientInfo/${patient.patient_id}`)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientsTable;