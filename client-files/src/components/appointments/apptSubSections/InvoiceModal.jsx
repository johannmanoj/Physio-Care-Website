import { React, useEffect, useState } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';

import { openInvoicePDF } from '../../invoice/Invoice';
import './InvoiceModal.css';

const API_URL = import.meta.env.VITE_API_URL;

function InvoiceModal({ patientData, selectedApptId, setShowInvoiceModal, userId }) {
    const { branchId } = useAuth();

    const [invoiceData, setInvoiceData] = useState([]);
    const [treatmentsList, setTreatmentsList] = useState([]);
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [days, setDays] = useState("");

    const [branchDetails, setBranchDetails] = useState(null);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const res = await axios.post(`${API_URL}/api/invoice/get-address-details`, { branch_id: branchId });
                setBranchDetails(res.data.data[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBranch();
    }, [branchId]);

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

    const handleNewInvoice = async () => {
        try {
            // Step 1: Create invoice in DB
            const total = invoiceData.reduce((acc, item) => acc + item.amount, 0);

            const createResponse = await axios.post(`${API_URL}/api/invoice/add-new-invoice`, {
                branch_id: branchId,
                practitioner_id: userId,
                patient_id: patientData.id,
                appointment_id: selectedApptId,
                total: total
            });

            if (!createResponse.data?.invoice_id) {
                toast.error("Failed to create invoice");
                return;
            }

            const invoice_id = createResponse.data.invoice_id;

            // Step 2: Generate PDF Blob
            const pdfBlob = await openInvoicePDF(patientData, selectedApptId, invoiceData, invoice_id, branchDetails, { openInNewTab: false });

            // Step 3: Upload the PDF
            const formData = new FormData();
            formData.append("file", pdfBlob, `invoice_${invoice_id}.pdf`);
            formData.append("type", "invoice");


            const uploadResponse = await axios.post(`${API_URL}/api/files/upload-file`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!uploadResponse.data?.url) {
                toast.error("Failed to upload invoice");
                return;
            }

            const invoice_url = uploadResponse.data.url;

            // Step 4: Update invoice record with URL
            await axios.post(`${API_URL}/api/invoice/update-invoice-url`, {
                id: invoice_id,
                invoice_url,
            });

            // Optionally open PDF in new tab after upload
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");

            toast.success("Invoice generated, uploaded, and saved successfully");
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Error generating invoice");
        }
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
                            
                <table className="common-table">
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
                {/* <button onClick={() => openInvoicePDF(patientData, selectedApptId, invoiceData)}>Generate</button> */}
                <button onClick={() => handleNewInvoice(patientData, selectedApptId, invoiceData)}>Generate</button>

                <button className="cancel-button" onClick={() => setShowInvoiceModal(false)} >Cancel</button>
            </div>
        </div>
    );
}

export default InvoiceModal;
