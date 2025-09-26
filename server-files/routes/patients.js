const express = require('express')
const router = express.Router()
const pool = require('../models/index');


router.post('/add-new-patient', async(req,res) =>{
    try {
        const { name, age, sex, contact_num, branch_id} = req.body;

        await pool.query('INSERT INTO patients (patient_name, sex, age, contact_num, branch_id) VALUES (?, ?, ?, ?, ?)', 
            [name, sex, age, contact_num, branch_id]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-patient-list', async(req,res) =>{
    try {
        const {branch_id} = req.body

        const [user_details] = await pool.query('SELECT * FROM patients WHERE branch_id = ? ORDER BY id DESC', [branch_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-patient-details', async(req,res) =>{
    try {
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE patient_id = ?', [patient_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})




//-This API is commented in the UI
router.post('/get-patient-image-files-list', async(req,res) =>{
    try {
        console.log("patient_id",req.body);
        
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM image_files WHERE patient_id = ?', [patient_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router
