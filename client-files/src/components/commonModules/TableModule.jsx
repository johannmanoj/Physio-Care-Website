import React from 'react';
import './TableModule.css';
import { useNavigate } from "react-router-dom";

const TableModule = ({ appointments }) => {
    const navigate = useNavigate();

    return (
        <div className="common-table-wrapper">
            <table className="common-table">
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
                    {appointments.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.name}</td>
                            <td>{appointment.patient_id}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.session_type}</td>
                            <td>
                                <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                    {appointment.status}
                                </span>
                            </td>
                            <td>
                                <button className="view-button" onClick={() => navigate(`/appointmentDetails/${appointment.patient_id}/${appointment.id}`)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableModule