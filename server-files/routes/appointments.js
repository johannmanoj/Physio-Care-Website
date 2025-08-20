const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/add-new-appointment', async(req,res) =>{
    try {
        const {patient_id, name, sex, age, contact_num, date, time, session_typ} = req.body;
        const status = "Upcoming"

        await pool.query('INSERT INTO appointments (patient_id, name, sex, age, contact_num, date, time, session_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [patient_id, name, sex, age, contact_num, date, time, session_typ, status]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointments-list', async(req,res) =>{
    try {
        const [user_details] = await pool.query('SELECT * FROM appointments', []);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointment-details', async(req,res) =>{
    try {
        const { appt_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appt_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-patient-appointment-list', async(req,res) =>{
    try {
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE patient_id = ?', [patient_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-appointment', async(req,res) =>{
    try {
        const {patient_id, name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc, sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc,xray_file,mri_desc,mri_file,ultrasound_desc,ultrasound_file,blood_report_desc,blood_report_file} = req.body;

        await pool.query('UPDATE appointments SET name=?, age=?, sex=?, occupation=?, contact_num=?, medical_allergies=?, address=?, other_ailments=?, subjective_desc=?, onexamination_desc=?, sketch_overlays=?, special_test_desc=?, goal_desc=? , program_desc=? ,xray_desc=?,xray_file=?,mri_desc=?,mri_file=?,ultrasound_desc=?,ultrasound_file=?,blood_report_desc=?,blood_report_file=? WHERE patient_id = ?', 
            [name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc,sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc,xray_file,mri_desc,mri_file,ultrasound_desc,ultrasound_file,blood_report_desc,blood_report_file, patient_id]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router