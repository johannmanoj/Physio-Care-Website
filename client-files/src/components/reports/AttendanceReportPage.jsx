import React, { useState } from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import EmployeesReportPage from './EmployeesReportPage'
import company_logo from '../../assets/invoice-logo.png'
import './AttendanceReportPage.css';


function AttendanceReportPage() {
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    function calculateFilteredAttendance(attendance, year, month) {
        if (!attendance) return { daily: {}, monthlyTotal: 0 };

        const daily = {};
        let monthlyTotal = 0;

        Object.entries(attendance).forEach(([date, { in: inTime, out: outTime }]) => {
            if (inTime && outTime) {
                const dateObj = new Date(inTime);
                const dYear = dateObj.getUTCFullYear().toString();
                const dMonth = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
                const dDay = String(dateObj.getUTCDate()).padStart(2, "0");

                // ✅ Ensure key format YYYY-MM-DD
                const key = `${dYear}-${dMonth}-${dDay}`;

                if (dYear === year && dMonth === month) {
                    const start = new Date(inTime);
                    const end = new Date(outTime);
                    const hours = (end - start) / (1000 * 60 * 60);

                    daily[key] = (parseFloat(daily[key] || 0) + hours).toFixed(2);
                    monthlyTotal += hours;
                }
            }
        });

        return { daily, monthlyTotal: monthlyTotal.toFixed(2) };
    }

    const viewfunction = (user) => {
        setSelectedUser(user);
        setShowAttendanceModal(true);
    }

    function downloadPDF(user, year, month, calculateFilteredAttendance) {
        if (!user || !year?.trim() || !month?.trim()) {
            alert("Please select year and month before downloading.");
            return;
        }

        const { daily, monthlyTotal } = calculateFilteredAttendance(
            user.attendance,
            year,
            month
        );

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Add company logo (right-aligned) ---
        const imgWidth = 55;
        const imgHeight = 15;
        doc.addImage(company_logo, "PNG", pageWidth - imgWidth - 14, 10, imgWidth, imgHeight);

        // --- Attendance Report heading (left-aligned) ---
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Attendance Report", 14, 20);

        // --- Line separator after header/logo ---
        doc.setDrawColor(150);
        doc.setLineWidth(0.5);
        const separatorY = 28;
        doc.line(14, separatorY, pageWidth - 14, separatorY);

        // --- Employee Details Section (space after separator) ---
        const detailsY = separatorY + 10;
        doc.setFontSize(11);

        // Employee ID
        doc.setFont("helvetica", "bold");
        doc.text("Employee ID : ", 14, detailsY, { align: "left" });
        doc.setFont("helvetica", "normal");
        doc.text(` ${user.id}`, 14 + doc.getTextWidth("Employee ID : "), detailsY);

        // Employee Name
        doc.setFont("helvetica", "bold");
        doc.text("Employee Name : ", 14, detailsY + 7, { align: "left" });
        doc.setFont("helvetica", "normal");
        doc.text(` ${user.name}`, 14 + doc.getTextWidth("Employee Name : "), detailsY + 7);

        // Month
        doc.setFont("helvetica", "bold");
        doc.text("Month : ", 14, detailsY + 14, { align: "left" });
        doc.setFont("helvetica", "normal");
        doc.text(` ${year}-${month}`, 14 + doc.getTextWidth("Month : "), detailsY + 14);

        // --- Build table rows ---
        const tableRows = [];
        let daysWorked = 0;

        Object.entries(user.attendance || {}).forEach(([date, { in: inTime, out: outTime }]) => {
            if (!inTime || !outTime) return;

            const d = new Date(inTime);
            const dYear = d.getUTCFullYear().toString();
            const dMonth = String(d.getUTCMonth() + 1).padStart(2, "0");

            if (dYear === year && dMonth === month) {
                const start = new Date(inTime);
                const end = new Date(outTime);
                const hours = ((end - start) / (1000 * 60 * 60)).toFixed(2);

                // Format date as dd-mm-yyyy
                const day = String(d.getUTCDate()).padStart(2, "0");
                const monthStr = String(d.getUTCMonth() + 1).padStart(2, "0");
                const formattedDate = `${day}-${monthStr}-${dYear}`;

                tableRows.push([
                    formattedDate,
                    start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    `${hours} hrs`,
                ]);

                if (parseFloat(hours) > 0) daysWorked++;
            }
        });

        // --- Attendance Table ---
        autoTable(doc, {
            startY: detailsY + 20,
            head: [["Date", "Time In", "Time Out", "Total Hours"]],
            body: tableRows,
            tableWidth: "auto",
            styles: { fontSize: 11, valign: "middle" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
            columnStyles: {
                0: { halign: "center" },
                1: { halign: "center" },
                2: { halign: "center" },
                3: { halign: "center" },
            },
        });

        // --- Separator after table ---
        const finalY = doc.lastAutoTable?.finalY || detailsY + 24;
        doc.setDrawColor(180);
        doc.setLineWidth(0.5);
        doc.line(14, finalY + 5, pageWidth - 14, finalY + 5);

        // --- Summary Section ---
        const daysInMonth = new Date(year, parseInt(month), 0).getDate();
        const leaves = daysInMonth - daysWorked;

        const summaryY = finalY + 15;
        doc.setFontSize(11);

        // Monthly Total
        doc.setFont("helvetica", "bold");
        doc.text("Monthly Total : ", 14, summaryY);
        doc.setFont("helvetica", "normal");
        doc.text(`    ${monthlyTotal} hrs`, 14 + doc.getTextWidth("Monthly Total: "), summaryY);

        // Days Worked
        doc.setFont("helvetica", "bold");
        doc.text("Days Worked : ", 14, summaryY + 6);
        doc.setFont("helvetica", "normal");
        doc.text(`  ${daysWorked}`, 14 + doc.getTextWidth("Days Worked: "), summaryY + 6);

        // Leaves
        doc.setFont("helvetica", "bold");
        doc.text("Leaves : ", 14, summaryY + 12);
        doc.setFont("helvetica", "normal");
        doc.text(`  ${leaves}`, 14 + doc.getTextWidth("Leaves: "), summaryY + 12);

        // --- Open PDF in new tab ---
        const pdfBlobUrl = doc.output("bloburl");
        window.open(pdfBlobUrl, "_blank");
    }

    
    return (
        <div className="common-page-layout">
            <EmployeesReportPage pageName={"AttendanceReportPage"} viewfunction={viewfunction} />

            {showAttendanceModal && selectedUser && (
                <div className="common-modal-overlay">
                    <div className="modal-container">
                        {/* Header */}
                        
                        <h2 className="modal-header">Attendance - {selectedUser.name}</h2>

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
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
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

                        {/* Attendance List */}
                        <div className="attendance-list">
                            {selectedYear && selectedMonth ? (
                                (() => {
                                    const { daily, monthlyTotal } = calculateFilteredAttendance(
                                        selectedUser.attendance,
                                        selectedYear,
                                        selectedMonth
                                    );

                                    return (
                                        <>
                                            {Object.entries(daily).length > 0 ? (
                                                Object.entries(daily).map(([date, hours]) => (
                                                    <div className="attendance-item" key={date}>
                                                        <span>{date}</span>
                                                        <span className="attendance-hours">{hours} hrs</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic">No attendance for this month</p>
                                            )}
                                            <p className="monthly-total">Monthly Total: {monthlyTotal} hrs</p>
                                        </>
                                    );
                                })()
                            ) : (
                                <p className="text-gray-400 italic">Please select Year and Month</p>
                            )}
                        </div>

                        <div className="common-modal-footer-layout">
                            <button className="common-modal-buttons-close" onClick={() => setShowAttendanceModal(false)}>Close</button>
                            <button className="common-modal-buttons-success" onClick={() =>
                                downloadPDF(
                                    selectedUser,
                                    selectedYear,
                                    selectedMonth,
                                    calculateFilteredAttendance
                                )
                            }> Download PDF </button>
                        </div>

                        {/* Footer */}
                        {/* <div className="modal-footer">
                            <button
                                className="download-btn"
                                onClick={() =>
                                    downloadPDF(
                                        selectedUser,
                                        selectedYear,
                                        selectedMonth,
                                        calculateFilteredAttendance
                                    )
                                }
                            >
                                Download PDF
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setShowAttendanceModal(false)}
                            >
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>
            )}

        </div>
    );
}

export default AttendanceReportPage;
