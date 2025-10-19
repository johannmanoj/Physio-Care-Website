import React, { useState, useEffect } from 'react';

import EmployeesReportPage from './EmployeesReportPage'
import AppointmentReportSection from './AppointmentReportSection'
// import './AppointmentReportPage.css';

function AppointmentReportPage() {
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const [selectedUserId, setSelectedUserId] = useState("")


    const viewfunction = (user) => {
        setSelectedUser(user);
        setShowAttendanceModal(true);
    }

    return (
        <div className="common-page-layout">

            {!showAttendanceModal && (
                <EmployeesReportPage pageName={"AppointmentReportPage"} viewfunction={viewfunction} setSelectedUserId={setSelectedUserId}/>
            )}

            {showAttendanceModal && selectedUser && (
                <AppointmentReportSection user_id={selectedUser.id}/>
            )}

        </div>
    );
}

export default AppointmentReportPage;
