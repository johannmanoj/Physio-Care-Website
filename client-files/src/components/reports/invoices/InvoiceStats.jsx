import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../../context/AuthContext";
import { FaFileInvoice, FaEye } from 'react-icons/fa';
import PaginationFooter from '../../common/PaginationFooter';
import './InvoiceStats.css';

const API_URL = import.meta.env.VITE_API_URL;

function InvoiceStats() {
    const navigate = useNavigate();
    const { employeeId } = useParams();
    const { role, userId, branchId } = useAuth();

    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const payload = { practitioner_id: employeeId, branch_id: branchId };
                const response = await axios.post(`${API_URL}/api/invoice/get-custom-invoice-list`, payload);
                setInvoices(response.data.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [role, userId]);

    // --- Filter invoices ---
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.id.toString().includes(searchTerm.toLowerCase());
        const invoiceDate = new Date(invoice.created);
        const matchesYear = year ? invoiceDate.getFullYear().toString() === year : true;
        const matchesMonth = month ? (invoiceDate.getMonth() + 1).toString() === month : true;
        return matchesSearch && matchesYear && matchesMonth;
    });

    // --- Calculate header stats (only paid invoices) ---
    const paidInvoices = filteredInvoices.filter(inv => inv.pymt_status?.toLowerCase() === "paid");

    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
    const cashRevenue = paidInvoices
        .filter(inv => inv.pymt_method?.toLowerCase() === "cash")
        .reduce((acc, inv) => acc + Number(inv.total || 0), 0);
    const upiRevenue = paidInvoices
        .filter(inv => inv.pymt_method?.toLowerCase() === "upi")
        .reduce((acc, inv) => acc + Number(inv.total || 0), 0);
    const cardRevenue = paidInvoices
        .filter(inv => inv.pymt_method?.toLowerCase() === "card")
        .reduce((acc, inv) => acc + Number(inv.total || 0), 0);

    // --- Pagination ---
    const indexOfLast = currentPage * appointmentsPerPage;
    const indexOfFirst = indexOfLast - appointmentsPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredInvoices.length / appointmentsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const page_count = `Showing ${indexOfFirst + 1} to ${Math.min(indexOfLast, filteredInvoices.length)} of ${filteredInvoices.length}`;

    if (loading) return <p></p>;

    // --- Year & Month options ---
    const years = Array.from(new Set(invoices.map(inv => new Date(inv.created).getFullYear().toString())));
    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <div>
            <div className='invoice-stats-header-layout'>
                <div className='invoice-stats-header-card'>
                    <label>Total Revenue</label>
                    <div className='invoice-stats-header-card-value'>₹ {totalRevenue.toLocaleString()}</div>
                </div>
                <div className='invoice-stats-header-card'>
                    <label>Cash Revenue</label>
                    <div className='invoice-stats-header-card-value'>₹ {cashRevenue.toLocaleString()}</div>
                </div>
                <div className='invoice-stats-header-card'>
                    <label>UPI Revenue</label>
                    <div className='invoice-stats-header-card-value'>₹ {upiRevenue.toLocaleString()}</div>
                </div>
                <div className='invoice-stats-header-card'>
                    <label>Card Revenue</label>
                    <div className='invoice-stats-header-card-value'>₹ {cardRevenue.toLocaleString()}</div>
                </div>
            </div>

            <div className="common-page-layout">
                <div className="common-page-header">
                    <h1>Invoices</h1>
                    <div className="filters">
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <select value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option value="">All Months</option>
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>

                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="Search Invoice ID here..."
                                value={searchTerm}
                                className='search-input'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="common-table-wrapper">
                    <table className="common-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Appointment ID</th>
                                <th>Patient ID</th>
                                <th>Amount</th>
                                <th>Invoice Date</th>
                                <th>Pymt Status</th>
                                <th>Pymt Method</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInvoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td>{invoice.id}</td>
                                    <td>{invoice.appointment_id}</td>
                                    <td>{invoice.patient_id}</td>
                                    <td>₹ {invoice.total}</td>
                                    <td>
                                        {new Date(invoice.created).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}
                                    </td>
                                    <td>{invoice.pymt_status}</td>
                                    <td>{invoice.pymt_method}</td>
                                    <td className='commn-table-action-td'>
                                        <div className='common-table-action-btn-layout'>
                                            <FaEye
                                                className='common-table-action-btn'
                                                onClick={() => window.open(invoice.invoice_url, "_blank")}
                                            />
                                        </div>
                                    </td>
                                    {/* <td>
                                        <button
                                            className="primary-button"
                                            onClick={() => window.open(invoice.invoice_url, "_blank")}
                                        >
                                            View
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {invoices.length === 0 && (
                    <div className='appointments-default-message'>
                        <FaFileInvoice className='appointments-default-logo' />
                        <div className='appointments-default-text'>No Invoices Yet</div>
                    </div>
                )}

                {invoices.length > 0 && (
                    <div className="table-footer">
                        <PaginationFooter
                            page_count={page_count}
                            playersPerPage={appointmentsPerPage}
                            totalPlayers={filteredInvoices.length}
                            paginate={paginate}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default InvoiceStats;
