const express = require('express');
const router = express.Router();
const pool = require('../models/index');
const bcrypt = require('bcrypt');


router.post('/get-users-list', async(req,res) =>{
    try {
        const [user_details] = await pool.query('SELECT * FROM users', []);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/add-user', async(req,res) =>{
    try {
        const {email, password, role} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email,hashedPassword,role]);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-user', async(req,res) =>{
    try {
        const {id, email, role} = req.body
        
        await pool.query('UPDATE users SET email=?, role=? WHERE id = ?', [email, role, id]);
       
        res.status(201).json({ message: 'User details updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;