import React from "react";
import "./BillingPage.css";



function BillingPage() {
  return (
    <div className="billing-page">
      <div className="billing-page-card">
        <h1>Create Invoice</h1>
        <h2>Patient Details</h2>
        <div className='billing-field-row'>
          <div className='billing-field billing-field-3'>
              <label htmlFor="patientName">Patient Name</label>
              <input type="text" id="patientName" />
          </div>
          <div className='billing-field billing-field-3'>
              <label htmlFor="patientId" id="patientId">Patient ID</label>
              <input type="text" />
          </div>
          <div className='billing-field billing-field-3'>
              <label htmlFor="contactNumber">Contact Number</label>
              <input type="tel" id="contactNumber" />
          </div>
        </div>
        <div className='billing-field-row'>
          <div className='billing-field billing-field-3'>
              <label htmlFor="invoiceDate">Invoice Date</label>
              <input type="date" id="invoiceDate" />
          </div>
          <div className='billing-field billing-field-3'>
              <label htmlFor="therapist">Therapist</label>
              <input type="text" id="therapist" />
          </div>
          <div className='billing-field billing-field-3'>
          </div>
        </div>

        {/* ─── 2. Billable Line‑Items Table ────────────────────────── */}
        <section className="billing-section">
          <h2>Services / Treatments</h2>

          <div className="billing-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th className="num">Rate (₹)</th>
                  <th className="num">Qty</th>
                  <th className="num">Subtotal (₹)</th>
                </tr>
              </thead>

              <tbody id="itemsBody" className="billing-table-body">
                {/* Example static row – replace with dynamic rows via state if needed */}
                <tr>
                  <td>
                    <input type="text" defaultValue="Physio – Knee Rehab" />
                  </td>
                  <td>
                    <input type="date" />
                  </td>
                  <td className="num">
                    <input type="number" defaultValue={500} />
                  </td>
                  <td className="num">
                    <input type="number" defaultValue={1} />
                  </td>
                  <td className="num subtotal">500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── 3. Billing Summary ─────────────────────────────────── */}
        <section className="billing-summary-card">
            <div className="billing-summary-row">
              <span>Subtotal</span>
              <span id="subtotal">₹500</span>
            </div>
            <div className="billing-summary-row">
              <span>Discount</span>
              <input type="number" defaultValue={0} className="num-input" />
            </div>
            <div className="billing-summary-row">
              <span>Tax (GST)</span>
              <input type="number" defaultValue={0} className="num-input" />
            </div>
            <br />
            <div className="billing-summary-row total">
              <span>Total</span>
              <span id="total">₹500</span>
            </div>
        </section>

        {/* ─── 4. Payment Details ─────────────────────────────────── */}
        <section>
          <h2>Payment Details</h2>

          <div className='billing-field-row'>
            <div className='billing-field billing-field-1'>
                <label htmlFor="amountPaid">Amount Paid (₹)</label>
                <input type="number" id="amountPaid" placeholder="0" />
            </div>
            <div className='billing-field billing-field-1'>
                <label htmlFor="paymentMode">Payment Mode</label>
                {/* <input type="number" id="amountPaid" placeholder="0" /> */}

                <select id="paymentMode">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Insurance</option>
                </select>
            </div>
          </div>

          <div className='billing-field-row'>
            <div className='billing-field billing-field-1'>
              <label htmlFor="transactionId">Transaction ID / Notes</label>
              <input type="text" id="transactionId" />
            </div>
            
          </div>
        </section>


        {/* ─── 5. Action Buttons ─────────────────────────────────── */}
        <div className="billing-actions">
          <button type="submit" className="billing-button btn-primary">
            Save Invoice
          </button>
          <button type="button" className=" billing-button btn-secondary">
            Print / PDF
          </button>
          <button type="button" className=" billing-button btn-secondary">
            Email
          </button>
          <button type="reset" className="billing-button btn-link">
            Clear Form
          </button>
        </div>
  
  
      </div>
    </div>
  );
}

// function BillingPage() {
//   return (
//     <div className="page-wrapper">
//       <h1 className="page-title">Create Invoice</h1>

//       <form id="invoiceForm">
//         {/* ─── 1. Patient / Invoice Header ─────────────────────────── */}
//         <section className="section">
//           <h2 className="section-title">Patient Details</h2>

//           <div className="grid-2">
//             <div className="form-group">
//               <label htmlFor="patientName">Patient Name</label>
//               <input type="text" id="patientName" placeholder="Priya Nair" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="patientId">Patient ID</label>
//               <input type="text" id="patientId" placeholder="PT‑1025" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="contactNumber">Contact Number</label>
//               <input type="tel" id="contactNumber" placeholder="98765 43210" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="invoiceDate">Invoice Date</label>
//               <input type="date" id="invoiceDate" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="therapist">Therapist</label>
//               <input type="text" id="therapist" placeholder="Dr. Kavya Menon" />
//             </div>
//           </div>
//         </section>

//         {/* ─── 2. Billable Line‑Items Table ────────────────────────── */}
//         <section className="section">
//           <h2 className="section-title">Services / Treatments</h2>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Service</th>
//                   <th>Date</th>
//                   <th className="num">Rate (₹)</th>
//                   <th className="num">Qty</th>
//                   <th className="num">Subtotal (₹)</th>
//                 </tr>
//               </thead>

//               <tbody id="itemsBody">
//                 {/* Example static row – replace with dynamic rows via state if needed */}
//                 <tr>
//                   <td>
//                     <input type="text" defaultValue="Physio – Knee Rehab" />
//                   </td>
//                   <td>
//                     <input type="date" />
//                   </td>
//                   <td className="num">
//                     <input type="number" defaultValue={500} />
//                   </td>
//                   <td className="num">
//                     <input type="number" defaultValue={1} />
//                   </td>
//                   <td className="num subtotal">500</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* ─── 3. Billing Summary ─────────────────────────────────── */}
//         <section className="section summary-grid">
//           <div className="summary-card">
//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span id="subtotal">₹500</span>
//             </div>
//             <div className="summary-row">
//               <span>Discount</span>
//               <input type="number" defaultValue={0} className="num-input" />
//             </div>
//             <div className="summary-row">
//               <span>Tax (GST)</span>
//               <input type="number" defaultValue={0} className="num-input" />
//             </div>
//             <hr />
//             <div className="summary-row total">
//               <span>Total</span>
//               <span id="total">₹500</span>
//             </div>
//           </div>
//         </section>

//         {/* ─── 4. Payment Details ─────────────────────────────────── */}
//         <section className="section">
//           <h2 className="section-title">Payment Details</h2>

//           <div className="grid-2">
//             <div className="form-group">
//               <label htmlFor="amountPaid">Amount Paid (₹)</label>
//               <input type="number" id="amountPaid" placeholder="0" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="paymentMode">Payment Mode</label>
//               <select id="paymentMode">
//                 <option>Cash</option>
//                 <option>Card</option>
//                 <option>UPI</option>
//                 <option>Insurance</option>
//               </select>
//             </div>
//             <div className="form-group grid-span-2">
//               <label htmlFor="transactionId">Transaction ID / Notes</label>
//               <input type="text" id="transactionId" />
//             </div>
//           </div>
//         </section>

//         {/* ─── 5. Action Buttons ─────────────────────────────────── */}
//         <div className="actions">
//           <button type="submit" className="btn-primary">
//             Save Invoice
//           </button>
//           <button type="button" className="btn-secondary">
//             Print / PDF
//           </button>
//           <button type="button" className="btn-secondary">
//             Email
//           </button>
//           <button type="reset" className="btn-link">
//             Clear Form
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

export default BillingPage;
