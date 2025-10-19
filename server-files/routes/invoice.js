const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/get-treatments-list', async (req, res) => {
  try {
    const [treatment_details] = await pool.query('SELECT * FROM treatments', []);

    res.status(201).json({ message: 'Patient details retrieved successfully', data: treatment_details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.post('/get-invoice-list', async (req, res) => {
  try {
    const { filter, practitioner_id, branch_id } = req.body;

    if (!branch_id) {
      return res.status(400).json({ message: 'branch_id is required' });
    }

    let query = 'SELECT * FROM invoices';
    let params = [];
    let conditions = [];

    // Always filter by branch
    conditions.push('branch_id = ?');
    params.push(branch_id);

    // Optional practitioner filter
    if (filter !== 'all' && practitioner_id) {
      conditions.push('practitioner_id = ?');
      params.push(practitioner_id);
    }

    // Build WHERE clause
    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY id DESC';

    const [invoice_details] = await pool.query(query, params);

    res.status(200).json({
      message: 'Invoice details retrieved successfully',
      data: invoice_details
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/get-custom-invoice-list', async (req, res) => {
  try {
    const { practitioner_id, branch_id } = req.body;

    const [result] = await pool.query(
      `SELECT invoices.*, appointments.pymt_status, appointments.pymt_method FROM invoices INNER JOIN appointments ON invoices.appointment_id = appointments.id where invoices.practitioner_id = ? AND invoices.branch_id = ?`,
      [practitioner_id, branch_id]
    );

    // result.insertId gives you the auto-generated ID
    res.status(201).json({ message: 'Invoice details retrieved successfully', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-invoice-url', async (req, res) => {
  try {
    const { id, invoice_url } = req.body;

    await pool.query('UPDATE invoices SET invoice_url = ? WHERE id = ?',
      [invoice_url, id]);

    res.status(201).json({ message: 'Patient details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.post('/update-appointment-invoice-url', async (req, res) => {
  try {
    const { id, invoice_url } = req.body;

    await pool.query('UPDATE appointments SET invoice_url = ? WHERE id = ?',
      [invoice_url, id]);

    res.status(201).json({ message: 'Patient details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.post('/get-address-details', async (req, res) => {
  try {
    const { branch_id } = req.body
    const [treatment_details] = await pool.query('SELECT * FROM branches WHERE id = ?', [branch_id]);

    res.status(201).json({ message: 'Patient details retrieved successfully', data: treatment_details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.post('/add-new-invoice', async (req, res) => {
    try {
        const { practitioner_id, patient_id, appointment_id, total, branch_id } = req.body;

        const [result] = await pool.query(
            'INSERT INTO invoices (practitioner_id, patient_id, appointment_id, total,branch_id) VALUES (?, ?, ?, ?, ?)',
            [practitioner_id, patient_id, appointment_id, total,branch_id]
        );

        // result.insertId gives you the auto-generated ID
        res.status(201).json({ 
            message: 'Invoice created successfully',
            invoice_id: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router