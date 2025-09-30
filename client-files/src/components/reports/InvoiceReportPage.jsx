import React, { useState, useEffect } from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import EmployeesReportPage from './EmployeesReportPage';
import company_logo from '../../assets/invoice-logo.png'
import './InvoiceReportPage.css';

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

    function downloadPDF() {
        if (!selectedUser || !selectedYear || !selectedMonth) {
            alert("Please select year and month before downloading.");
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Company logo (right-aligned) ---
        const imgWidth = 55;
        const imgHeight = 15;
        doc.addImage(company_logo, "PNG", pageWidth - imgWidth - 14, 10, imgWidth, imgHeight);

        // --- Report heading (left-aligned) ---
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Invoice Report", 14, 20);

        // --- Separator line after heading/logo ---
        const separatorY = 28;
        doc.setDrawColor(150);
        doc.setLineWidth(0.5);
        doc.line(14, separatorY, pageWidth - 14, separatorY);

        // --- Practitioner Details (leave space after separator) ---
        const detailsY = separatorY + 10;
        doc.setFontSize(11);

        // ID
        doc.setFont("helvetica", "bold");
        doc.text("Practitioner ID : ", 14, detailsY);
        doc.setFont("helvetica", "normal");
        doc.text(`   ${selectedUser.id}`, 14 + doc.getTextWidth("Practitioner ID: "), detailsY);

        // Name
        doc.setFont("helvetica", "bold");
        doc.text("Practitioner Name : ", 14, detailsY + 7);
        doc.setFont("helvetica", "normal");
        doc.text(`   ${selectedUser.name}`, 14 + doc.getTextWidth("Practitioner Name: "), detailsY + 7);

        // Year/Month
        doc.setFont("helvetica", "bold");
        doc.text("Year / Month : ", 14, detailsY + 14);
        doc.setFont("helvetica", "normal");
        doc.text(`     ${selectedYear}-${selectedMonth}`, 14 + doc.getTextWidth("Year/Month: "), detailsY + 14);

        // --- Table of invoices ---
        if (!invoices.length) {
            doc.setFont("helvetica", "normal");
            doc.text("No invoices found for this month.", 14, detailsY + 28);
        } else {
            const tableRows = invoices.map((inv) => [
                inv.id,
                (Number(inv.total) || 0).toFixed(2),
            ]);

            autoTable(doc, {
                startY: detailsY + 20,
                head: [["Invoice ID", "Total Amount"]],
                body: tableRows,
                styles: { fontSize: 11, halign: "center", valign: "middle" },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
                tableWidth: "auto",
            });

            // --- Separator after table ---
            const finalY = doc.lastAutoTable?.finalY || detailsY + 24;
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.line(14, finalY + 5, pageWidth - 14, finalY + 5);

            // --- Summary Section ---
            const totalSum = invoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
            const summaryY = finalY + 12;
            const lineHeight = 6;

            // Monthly Total
            doc.setFont("helvetica", "bold");
            doc.text("Monthly Total : ", 14, summaryY);
            doc.setFont("helvetica", "normal");
            doc.text(`    ${totalSum.toFixed(2)}`, 14 + doc.getTextWidth("Monthly Total: "), summaryY);

            // Number of invoices
            doc.setFont("helvetica", "bold");
            doc.text("Number of Invoices : ", 14, summaryY + lineHeight);
            doc.setFont("helvetica", "normal");
            doc.text(`   ${invoices.length}`, 14 + doc.getTextWidth("Number of Invoices: "), summaryY + lineHeight);
        }

        // --- Open PDF in new tab ---
        const pdfBlobUrl = doc.output("bloburl");
        window.open(pdfBlobUrl, "_blank");
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
                                <option value="2024">2023</option>
                                <option value="2024">2022</option>
                                <option value="2024">2021</option>
                                <option value="2024">2020</option>
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
                                    <div className="modal-table-container">
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
                                    </div>
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
