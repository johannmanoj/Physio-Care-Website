import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InvoiceReportPage.css';
import EmployeesReportPage from './EmployeesReportPage';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth } from "../../context/AuthContext";


const API_URL = import.meta.env.VITE_API_URL;

function InvoiceReportPage() {
    const { branchId } = useAuth();

    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        if (!selectedUser || !selectedYear || !selectedMonth) return;

        const fetchInvoices = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/invoice/get-invoice-list`, {
                    filter: "practitioner",
                    practitioner_id: selectedUser.id,
                    branch_id: branchId
                });

                const allInvoices = response.data.data || response.data.invoices || [];

                // ✅ Filter locally by year & month
                const filteredInvoices = allInvoices.filter((inv) => {
                    const rawDate = inv.created || inv.created_at || inv.invoice_date;
                    if (!rawDate) return false;

                    const invDate = new Date(rawDate);
                    const invYear = invDate.getUTCFullYear().toString();
                    const invMonth = String(invDate.getUTCMonth() + 1).padStart(2, "0");

                    return invYear === selectedYear && invMonth === selectedMonth;
                });

                setInvoices(filteredInvoices);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchInvoices();
    }, [selectedUser, selectedYear, selectedMonth]);

    // ✅ PDF Download Function
    function downloadPDF() {
        if (!selectedUser || !selectedYear || !selectedMonth) {
            alert("Please select year and month before downloading.");
            return;
        }

        const doc = new jsPDF();

        // Header
        doc.setFontSize(16);
        doc.text(`Invoice Report - ${selectedUser.name}`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Year: ${selectedYear}, Month: ${selectedMonth}`, 14, 28);

        if (invoices.length === 0) {
            doc.text("No invoices found for this month.", 14, 40);
        } else {
            const totalSum = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);

            const tableData = invoices.map((inv) => [
                inv.id,
                inv.total,
                inv.invoice_url || inv.url ? "View Link" : "No Link"
            ]);

            autoTable(doc, {
                startY: 40,
                head: [["Invoice ID", "Total", "Link"]],
                body: tableData,
            });

            const finalY = doc.lastAutoTable?.finalY || 40;
            doc.setFontSize(12);
            doc.text(`Monthly Total: ${totalSum.toFixed(2)}`, 14, finalY + 10);
        }

        doc.save(`Invoice_${selectedUser.name}_${selectedYear}-${selectedMonth}.pdf`);
    }

    const viewfunction = (user) => {
        setSelectedUser(user);
        setShowRevenueModal(true);
    };

    return (
        <div className="patients-page-container">
            <EmployeesReportPage viewfunction={viewfunction} />

            {showRevenueModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        {/* Header */}
                        <h2 className="modal-header">{selectedUser.name} - Invoice Report</h2>

                        {/* Year & Month Selection */}
                        <div className="filter-row">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Select Year</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>

                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Select Month</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>

                        {/* Invoice List */}
                        <div className="invoice-list">
                            {selectedYear && selectedMonth ? (
                                invoices.length > 0 ? (
                                    <table className="invoice-table">
                                        <thead>
                                            <tr>
                                                <th>Invoice ID</th>
                                                <th>Total</th>
                                                <th>View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((inv) => (
                                                <tr key={inv.id}>
                                                    <td>{inv.id}</td>
                                                    <td>{inv.total}</td>
                                                    <td>
                                                        {inv.invoice_url || inv.url ? (
                                                            <a
                                                                href={
                                                                    (inv.invoice_url || inv.url).startsWith("http")
                                                                        ? inv.invoice_url || inv.url
                                                                        : `https://${inv.invoice_url || inv.url}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="view-link"
                                                            >
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400 italic">No Link</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-400 italic">No invoices found for this month</p>
                                )
                            ) : (
                                <p className="text-gray-400 italic">Please select Year and Month</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button className="download-btn" onClick={downloadPDF}>
                                Download PDF
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setShowRevenueModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InvoiceReportPage;
