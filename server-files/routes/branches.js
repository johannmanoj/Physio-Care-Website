const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/get-branches-list', async (req, res) => {
    try {
        const [user_details] = await pool.query('SELECT * FROM branches', []);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/add-new-branch', async (req, res) => {
    try {
        const {name,address_line_1,address_line_2,address_line_3,phone_1,phone_2} = req.body;

        await pool.query('INSERT INTO branches (name,address_line_1,address_line_2,address_line_3,phone_1,phone_2) VALUES (?,?,?,?,?,?)',
            [name,address_line_1,address_line_2,address_line_3,phone_1,phone_2]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-branch', async (req, res) => {
    try {
        const { id,name,address_line_1,address_line_2,address_line_3,phone_1,phone_2} = req.body

        await pool.query('UPDATE branches SET name=?,address_line_1=?,address_line_2=?,address_line_3=?,phone_1=?,phone_2=? WHERE id = ?', 
            [name,address_line_1,address_line_2,address_line_3,phone_1,phone_2, id]
        );
            
        res.status(201).json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;