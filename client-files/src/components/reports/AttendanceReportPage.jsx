import React, { useState } from 'react';
import axios from 'axios';
import './AttendanceReportPage.css';
import EmployeesReportPage from './EmployeesReportPage'

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL

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

        // Get daily data and monthly total
        const { daily, monthlyTotal } = calculateFilteredAttendance(
            user.attendance,
            year,
            month
        );

        const doc = new jsPDF();

        // Header
        doc.setFontSize(16);
        doc.text(`Attendance Report - ${user.name}`, 14, 20);
        doc.setFontSize(12);
        doc.text(`${year}-${month}`, 14, 28);

        // ✅ Calendar-like table
        const daysInMonth = new Date(year, parseInt(month), 0).getDate();
        const startDay = new Date(`${year}-${month}-01`).getDay(); // Sunday = 0
        const weeks = [];
        let week = new Array(7).fill(""); // 7 days per week

        let dayCounter = 1;
        let daysWorked = 0;
        let leaves = 0;

        // Fill first week
        for (let i = startDay; i < 7; i++) {
            const dayStr = String(dayCounter).padStart(2, "0");
            const key = `${year}-${month}-${dayStr}`;
            const hours = daily[key] || "0.00";

            if (parseFloat(hours) > 0) daysWorked++;
            else leaves++;

            week[i] = `${dayCounter}\n${hours} hrs`;
            dayCounter++;
        }
        weeks.push(week);

        // Fill rest of the weeks
        while (dayCounter <= daysInMonth) {
            week = new Array(7).fill("");
            for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
                const dayStr = String(dayCounter).padStart(2, "0");
                const key = `${year}-${month}-${dayStr}`;
                const hours = daily[key] || "0.00";

                if (parseFloat(hours) > 0) daysWorked++;
                else leaves++;

                week[i] = `${dayCounter}\n${hours} hrs`;
                dayCounter++;
            }
            weeks.push(week);
        }

        // ✅ Use autoTable
        autoTable(doc, {
            startY: 40,
            head: [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]],
            body: weeks,
        });

        // Monthly total + summary
        const finalY = doc.lastAutoTable?.finalY || 40;
        doc.setFontSize(12);
        doc.text(`Monthly Total: ${monthlyTotal} hrs`, 14, finalY + 10);
        doc.text(`Days Worked: ${daysWorked}`, 14, finalY + 20);
        doc.text(`Leaves: ${leaves}`, 14, finalY + 30);

        // Save PDF
        const pdfBlobUrl = doc.output("bloburl");
        window.open(pdfBlobUrl, "_blank");
        // doc.save(`Attendance_${user.name}_${year}-${month}.pdf`);
    }

    

    return (
        <div className="patients-page-container">
            <EmployeesReportPage viewfunction={viewfunction} />

            {showAttendanceModal && selectedUser && (
                <div className="modal-overlay">
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

                        {/* Footer */}
                        <div className="modal-footer">
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
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AttendanceReportPage;
