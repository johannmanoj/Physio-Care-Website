const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/add-new-appointment', async (req, res) => {
    try {
        const { practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, onexamination_desc } = req.body;
        const status = "Upcoming"

        await pool.query('INSERT INTO appointments (practitioner, patient_id, name, sex, age, contact_num, date, time, session_type, status, onexamination_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, status, onexamination_desc]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointments-list', async (req, res) => {
    try {
        const [user_details] = await pool.query('SELECT * FROM appointments ORDER BY id DESC', []);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-practitioner-appointments-list', async (req, res) => {
    try {
        const { practitioner_id } = req.body

        const [user_details] = await pool.query('SELECT * FROM appointments where practitioner=? ORDER BY id DESC', [practitioner_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-practitioner-patient-appointments-list', async (req, res) => {
    try {
        const { practitioner_id , patient_id} = req.body

        const [user_details] = await pool.query('SELECT * FROM appointments where practitioner=? and patient_id = ? ORDER BY id DESC', [practitioner_id, patient_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointment-details', async (req, res) => {
    try {
        const { appt_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appt_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-patient-appointment-list', async (req, res) => {
    try {
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE patient_id = ? ORDER BY date desc', [patient_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-appointment', async (req, res) => {
    try {
        const { 
            appt_id, 
            name, 
            age, 
            sex, 
            occupation, 
            contact_num, 
            medical_allergies, 
            address, 
            other_ailments, 
            subjective_desc, 
            onexamination_desc, 
            sketch_overlays, 
            special_test_desc, 
            goal_desc, 
            program_desc, 
            xray_desc, 
            mri_desc, 
            ultrasound_desc, 
            blood_report_desc, 
            xray_file_1, 
            xray_file_2, 
            xray_file_3, 
            xray_file_4, 
            mri_file_1, 
            mri_file_2, 
            mri_file_3, 
            mri_file_4, 
            ultrasound_file_1, 
            ultrasound_file_2, 
            ultrasound_file_3, 
            ultrasound_file_4, 
            blood_report_file_1,
            blood_report_file_2,
            blood_report_file_3,
            blood_report_file_4, 
        } = req.body;
        
        await pool.query('UPDATE appointments SET name=?, age=?, sex=?, occupation=?, contact_num=?, medical_allergies=?, address=?, other_ailments=?, subjective_desc=?, onexamination_desc=?, sketch_overlays=?, special_test_desc=?, goal_desc=? , program_desc=? ,xray_desc=?,mri_desc=?,ultrasound_desc=?,blood_report_desc=?,xray_file_1=?, xray_file_2=?, xray_file_3=?, xray_file_4=?,  mri_file_1=?, mri_file_2=?, mri_file_3=?, mri_file_4=?, ultrasound_file_1=?, ultrasound_file_2=?, ultrasound_file_3=?,  ultrasound_file_4=?, blood_report_file_1=?, blood_report_file_2=?, blood_report_file_3=?,  blood_report_file_4=? WHERE id = ?',
            [name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc, sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc,mri_desc,ultrasound_desc, blood_report_desc, xray_file_1,xray_file_2,xray_file_3,xray_file_4, mri_file_1,mri_file_2, mri_file_3,mri_file_4, ultrasound_file_1,ultrasound_file_2,ultrasound_file_3, ultrasound_file_4, blood_report_file_1,blood_report_file_2, blood_report_file_3, blood_report_file_4, appt_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router