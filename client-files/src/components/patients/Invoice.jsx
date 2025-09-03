// Invoice.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from "@react-pdf/renderer";
import clinicLogo from '../../assets/company-logo.png';

// --- Font registration ---
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});

// --- Styles ---
const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: "Roboto", fontSize: 11, lineHeight: 1.4 },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  clinicInfo: { fontSize: 9, textAlign: "right" },
  logo: { width: 200, height: 58 },
  separator: { borderBottomWidth: 1, borderBottomColor: "#000", marginBottom: 15 },

  // Patient & Bill info
  infoBlock: { marginBottom: 10 },
  label: { fontWeight: "bold" },

  // Table
  table: { display: "table", width: "auto", marginTop: 6, borderStyle: "solid", borderWidth: 1 },
  tableRow: { flexDirection: "row" },
  tableHeader: { fontWeight: "bold", borderStyle: "solid", borderWidth: 1, padding: 3, fontSize: 10, textAlign: "center" },
  tableCell: { borderStyle: "solid", borderWidth: 1, padding: 3, fontSize: 10 },

  // Adjusted column widths
  colSl: { width: "7%" },
  colDesc: { width: "58%", paddingLeft: 5 },
  colDays: { width: "12%" },
  colRate: { width: "10%" },
  colAmt: { width: "15%" },

  // Footer
  totals: { marginTop: 10 },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 },
  totalLabel: { fontWeight: "bold", marginRight: 10 },
  signature: { marginTop: 30, textAlign: "right", fontSize: 11 },

  // Rupees in words row (right aligned)
  rupeesRow: { flexDirection: "row", justifyContent: "flex-end" },
  rupeesText: { fontSize: 10, marginTop: 4 }, // No italics
});

const numberToWords = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  };

  return numToWords(num);
};

// --- Invoice document ---
const InvoiceDocument = ({ patientData, selectedApptId, invoiceData = [] , invoice_id}) => {
  const totalAmount = invoiceData.reduce((sum, item) => {
    const amt = parseFloat(item.amount) || 0;
    return sum + amt;
  }, 0);

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={clinicLogo} style={styles.logo} />
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <Text style={styles.clinicInfo}>TC NO 24/136, CHITRA NAGAR</Text>
            <Text style={styles.clinicInfo}>PIPELINE ROAD, KOWDIAR P.O</Text>
            <Text style={styles.clinicInfo}>THIRUVANANTHAPURAM - 695004</Text>
            <Text style={styles.clinicInfo}>
              <Text style={{ fontWeight: "bold" }}>Mob: +91 96053 11234 / +91 96054 11234 </Text>
            </Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Patient & Bill info */}
        <View style={styles.infoBlock}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text>
              <Text style={styles.label}>Sl. No: </Text>
              {invoice_id || "097/2025"}
            </Text>
            <Text>
              <Text style={styles.label}>Date: </Text>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text>
              <Text style={styles.label}>Name: </Text>
              {patientData.name || "-"}
            </Text>
            <Text>
              <Text style={styles.label}>Age: </Text>
              {patientData.age || "-"}{"   "}
              <Text style={styles.label}>Sex: </Text>
              {patientData.sex || "-"}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.colSl]}>Sl. No</Text>
            <Text style={[styles.tableHeader, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeader, styles.colDays]}>No. of Days</Text>
            <Text style={[styles.tableHeader, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeader, styles.colAmt]}>Amount</Text>
          </View>

          {/* Data rows */}
          {invoiceData.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.colSl, { textAlign: "center" }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.treatment || "-"}</Text>
              <Text style={[styles.tableCell, styles.colDays, { textAlign: "center" }]}>{item.days || "-"}</Text>
              <Text style={[styles.tableCell, styles.colRate, { textAlign: "center" }]}>{item.rate || "-"}/-</Text>
              <Text style={[styles.tableCell, styles.colAmt, { textAlign: "center" }]}>{item.amount || "-"}/-</Text>
            </View>
          ))}

          {/* Total row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "85.5%", textAlign: "right", fontWeight: "bold" }]}>
              TOTAL
            </Text>
            <Text style={[styles.tableCell, { width: "14.5%", textAlign: "center" }]}>{totalAmount}/-</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "100%", textAlign: "left" }]}>
              Rupees in words: {numberToWords(totalAmount)} only
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.signature}>Authorised Signature</Text>
      </Page>
    </Document>
  );
};



// // --- Function to open PDF in new tab ---
// export const openInvoicePDF = async (patientData, selectedApptId, invoiceData, invoice_id) => {
//   const blob = await pdf(
//     <InvoiceDocument
//       patientData={patientData}
//       selectedApptId={selectedApptId}
//       invoiceData={invoiceData}
//       invoice_id={invoice_id}
//     />
//   ).toBlob();
//   const url = URL.createObjectURL(blob);
//   window.open(url, "_blank");
// };

export const openInvoicePDF = async (patientData, selectedApptId, invoiceData, invoice_id, { openInNewTab = true } = {}) => {
    const blob = await pdf(
        <InvoiceDocument
            patientData={patientData}
            selectedApptId={selectedApptId}
            invoiceData={invoiceData}
            invoice_id={invoice_id}
        />
    ).toBlob();

    // Open in new tab if required
    if (openInNewTab) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }

    return blob; // Return Blob for uploading
};


export default InvoiceDocument;
