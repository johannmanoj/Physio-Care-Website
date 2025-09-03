import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import './InvoiceModal.css';
import { openInvoicePDF } from '../patients/Invoice';

const API_URL = import.meta.env.VITE_API_URL;

function InvoiceModal({ patientData, selectedApptId, setShowInvoiceModal }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [treatmentsList, setTreatmentsList] = useState([]);
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [days, setDays] = useState("");

    // Fetch treatments list on mount
    useEffect(() => {
        axios.post(`${API_URL}/api/invoice/get-treatments-list`)
            .then((response) => {
                if (response.data && response.data.data) {
                    setTreatmentsList(response.data.data);
                } else {
                    toast.error("No treatments found");
                }
            })
            .catch((error) => {
                console.error("Error fetching treatments:", error);
                toast.error("Failed to load treatments");
            });
    }, []);

    // Handle Add Record
    const handleAdd = () => {
        if (!selectedTreatment || !days) {
            toast.error("Please select a treatment and enter days");
            return;
        }

        const treatmentObj = treatmentsList.find(
            (t) => t.id.toString() === selectedTreatment
        );

        if (!treatmentObj) {
            toast.error("Invalid treatment selected");
            return;
        }

        const rate = parseInt(treatmentObj.rate);
        const amount = rate * parseInt(days);

        const newRecord = {
            treatment: treatmentObj.treatment,
            days,
            rate,
            amount,
        };

        setInvoiceData([...invoiceData, newRecord]);
        setSelectedTreatment("");
        setDays("");
    };

    // Handle Delete Record
    const handleDelete = (index) => {
        const updatedData = invoiceData.filter((_, i) => i !== index);
        setInvoiceData(updatedData);
    };

    return (
        <div>
            <Toaster />
            <div className='invoice-header'>Invoice</div>
            <div className='invoice-body'>
                <div className="invoice-field-row">
                    <div className="invoice-field invoice-field-3">
                        <label>Treatment</label>
                        <select
                            value={selectedTreatment}
                            onChange={(e) => setSelectedTreatment(e.target.value)}
                        >
                            <option value="">-- Select Treatment --</option>
                            {treatmentsList.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.treatment} (₹{t.rate})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="invoice-field invoice-field-3">
                        <label>Days</label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            placeholder="Days"
                        />
                    </div>

                    <div className="invoice-field invoice-field-3">
                        <button className="invoice-add-button" onClick={handleAdd}>
                            Add
                        </button>
                    </div>
                </div>

                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Treatment</th>
                            <th>Days</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.treatment}</td>
                                <td>{data.days}</td>
                                <td>₹{data.rate}</td>
                                <td>₹{data.amount}</td>
                                <td>
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            <div className="modal-buttons">
                <button onClick={() => openInvoicePDF(patientData, selectedApptId, invoiceData)}>Generate</button>

                <button className="cancel-button" onClick={() => setShowInvoiceModal(false)} >Cancel</button>
            </div>
        </div>
    );
}

export default InvoiceModal;
