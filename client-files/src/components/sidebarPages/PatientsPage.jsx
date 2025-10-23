import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaEye } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';
import './PatientsPage.css';

const API_URL = import.meta.env.VITE_API_URL

function PatientsPage() {
  const navigate = useNavigate();
  const { branchId } = useAuth();

  const patient_data = {
    name: '',
    sex: '',
    age: '',
    contact_num: '',
    branch_id: branchId
  }

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState(patient_data);

  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);



  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/patients/get-all-patients-list`, {
        branch_id: branchId,
        page: currentPage,
        limit: patientsPerPage,
        search: searchTerm
      });
      const { data, total, totalPages } = response.data;
      setPatients(data);
      setTotalPages(totalPages);
      setTotalPatients(total);
    } catch (error) {
      console.error("Error fetching patients data:", error);
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // reset page when search changes
  }, [searchTerm]);

  const handleAddPatient = () => {
    const { name, sex, age, contact_num } = newPatient;

    if (!name || !sex || !age || !contact_num) {
      toast.error("Please fill all fields before adding patient.");
      return;
    }

    axios.post(`${API_URL}/api/patients/add-new-patient`, newPatient)
      .then(() => {
        toast.success("Patient added successfully!");
        setShowAddModal(false);
        setNewPatient(patient_data);
        fetchPatients();
      })
      .catch((error) => {
        toast.error("Failed to add patient. Try again.");
        console.error('Error adding patient:', error);
      });
  };


  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // if (loading) { return <p></p>; }
  return (
    <div className="common-page-layout">
      <div className="common-page-header">
        <h1>Patients</h1>

        <div className="filters">
          <button className="primary-button" onClick={() => setShowAddModal(true)}>Add Patient</button>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search Name here..."
              value={searchTerm}
              className='search-input'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="common-table-wrapper">
        <table className="common-table">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "30px" }} />
          </colgroup>

          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Contact Number</th>
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
                <td className='commn-table-action-td'>
                  <div className='common-table-action-btn-layout'>
                    <FaEye
                      className='common-table-action-btn'
                      onClick={() => navigate(`/patientAppointments/${patient.id}/${patient.patient_name}`)}
                    />
                  </div>
                  {/* <button className="primary-button" onClick={() => navigate(`/patientAppointments/${patient.id}/${patient.patient_name}`)}>View</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length == 0 && (
        <div className='appointments-default-message'>
          {/* <FaUserInjured className='appointments-default-logo' /> */}
          <div className='appointments-default-text'>No Patients Yet</div>
        </div>
      )}

      {totalPatients > 0 && (
        <div className="table-footer">
          <PaginationFooter
            page_count={`Showing ${(currentPage - 1) * patientsPerPage + 1} to ${Math.min(currentPage * patientsPerPage, totalPatients)} of ${totalPatients}`}
            playersPerPage={patientsPerPage}
            totalPlayers={totalPatients}
            paginate={paginate}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}


      {showAddModal && (
        <div className="common-modal-overlay">
          <div className="common-modal-content">
            <div className="common-modal-header">
              <h1>Add Patient</h1>
            </div>

            <div className="common-modal-body">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
              <label>Sex</label>

              <select
                id="sex"
                // value={patientData.sex ?? ''}
                onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              
              <label>Age</label>
              <input
                type="number"
                placeholder="Enter Age"
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
              />
              <label>Contact Number</label>
              <input
                type="number"
                placeholder="Enter Number"
                onChange={(e) => setNewPatient({ ...newPatient, contact_num: e.target.value })}
              />
            </div>

            <div className="common-modal-footer-layout">
              <button className="common-modal-buttons-close" onClick={() => setShowAddModal(false)}>Close</button>
              <button className="common-modal-buttons-success" onClick={handleAddPatient}> Add </button>
            </div>

            {/* <div className="modal-buttons">
              <button className="view-button" onClick={handleAddPatient}>Add</button>
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div> */}
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#1e293b",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1e293b",
            },
          },
        }}
      />
    </div>
  );
}

export default PatientsPage;