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
    const { filter, practitioner_id } = req.body;
    console.log("req.body---",req.body);
    

    let query = 'SELECT * FROM invoices';
    let params = [];

    if (filter !== 'all' && practitioner_id) {
      query += ' WHERE practitioner_id = ?';
      params.push(practitioner_id);
    }

    const [invoice_details] = await pool.query(query, params);

    res.status(200).json({
      message: 'Invoice details retrieved successfully',
      data: invoice_details
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/add-new-invoice', async (req, res) => {
    try {
        const { practitioner_id, patient_id, appointment_id } = req.body;

        const [result] = await pool.query(
            'INSERT INTO invoices (practitioner_id, patient_id, appointment_id) VALUES (?, ?, ?)',
            [practitioner_id, patient_id, appointment_id]
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



module.exports = router