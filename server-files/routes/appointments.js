const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/add-new-appointment', async (req, res) => {
    try {
        const { practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, onexamination_desc, branch_id } = req.body;
        const status = "Upcoming"

        await pool.query('INSERT INTO appointments (practitioner, patient_id, name, sex, age, contact_num, date, time, session_type, status, onexamination_desc, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, status, onexamination_desc, branch_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointments-list', async (req, res) => {
    try {
        let query = 'SELECT * FROM appointments';
        let params = [];
        let conditions = [];

        if (req.body && req.body.branch_id) {
            conditions.push('branch_id = ?');
            params.push(req.body.branch_id);
        } else {
            return res.status(400).json({ message: 'branch_id is required' });
        }

        if (req.body.practitioner_id) {
            conditions.push('practitioner = ?');
            params.push(req.body.practitioner_id);
        }

        if (req.body.patient_id) {
            conditions.push('patient_id = ?');
            params.push(req.body.patient_id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY id DESC';

        const [appointments] = await pool.query(query, params);

        res.status(200).json({
            message: 'Appointments retrieved successfully',
            data: appointments
        });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/get-patient-appointment-list', async (req, res) => {
    try {
        const { patient_id , branch_id} = req.body;

        const [user_details] = await pool.query('SELECT * FROM appointments WHERE patient_id = ? AND branch_id = ? ORDER BY date desc', [patient_id, branch_id]);

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

router.post('/update-appointment', async (req, res) => {
    try {
        const {
            appt_id,
            name,
            status,
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
            pymt_status,
            pymt_method
        } = req.body;

        await pool.query('UPDATE appointments SET name=?, status=?, age=?, sex=?, occupation=?, contact_num=?, medical_allergies=?, address=?, other_ailments=?, subjective_desc=?, onexamination_desc=?, sketch_overlays=?, special_test_desc=?, goal_desc=? , program_desc=? ,xray_desc=?,mri_desc=?,ultrasound_desc=?,blood_report_desc=?,xray_file_1=?, xray_file_2=?, xray_file_3=?, xray_file_4=?,  mri_file_1=?, mri_file_2=?, mri_file_3=?, mri_file_4=?, ultrasound_file_1=?, ultrasound_file_2=?, ultrasound_file_3=?,  ultrasound_file_4=?, blood_report_file_1=?, blood_report_file_2=?, blood_report_file_3=?,  blood_report_file_4=?, pymt_status=?, pymt_method=? WHERE id = ?',
            [name, status, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc, sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc, mri_desc, ultrasound_desc, blood_report_desc, xray_file_1, xray_file_2, xray_file_3, xray_file_4, mri_file_1, mri_file_2, mri_file_3, mri_file_4, ultrasound_file_1, ultrasound_file_2, ultrasound_file_3, ultrasound_file_4, blood_report_file_1, blood_report_file_2, blood_report_file_3, blood_report_file_4, pymt_status, pymt_method, appt_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router