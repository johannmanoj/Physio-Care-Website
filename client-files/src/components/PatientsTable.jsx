import './PatientsTable.css'; 
import { useNavigate } from "react-router-dom";


function PatientsTable({ patients }) {
  const navigate = useNavigate();

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
            {/* <th>Last Visit</th> */}
            {/* <th>Status</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.patient_name}</td>
              <td>{patient.sex}</td>
              <td>{patient.age}</td>
              <td>{patient.contact_num}</td>
              {/* <td></td> */}
              {/* <td></td> */}
              <td>
                <button className="view-button" onClick={() => navigate(`/patientAppointments/${patient.id}/${patient.patient_name}`)}>View</button>
                {/* <button className="view-button" onClick={() => navigate(`/patientInfo/${patient.patient_id}`)}>View</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientsTable;