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



module.exports = router