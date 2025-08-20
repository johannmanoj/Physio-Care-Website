const express = require('express')
const router = express.Router()
const pool = require('../models/index');


router.post('/add-new-patient', async(req,res) =>{
    try {
        const { name, age, sex, contact_num} = req.body;

        await pool.query('INSERT INTO patients (patient_name,sex,age,contact_num) VALUES (?, ?, ?, ?)', 
            [name, sex, age, contact_num]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-patient-list', async(req,res) =>{
    try {
        const [user_details] = await pool.query('SELECT * FROM patients', []);
       
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




// router.post('/update-patient', async(req,res) =>{
//     try {
//         const {patient_id, name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc, sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc,xray_file,mri_desc,mri_file,ultrasound_desc,ultrasound_file,blood_report_desc,blood_report_file} = req.body;

//         await pool.query('UPDATE appointments SET name=?, age=?, sex=?, occupation=?, contact_num=?, medical_allergies=?, address=?, other_ailments=?, subjective_desc=?, onexamination_desc=?, sketch_overlays=?, special_test_desc=?, goal_desc=? , program_desc=? ,xray_desc=?,xray_file=?,mri_desc=?,mri_file=?,ultrasound_desc=?,ultrasound_file=?,blood_report_desc=?,blood_report_file=? WHERE patient_id = ?', 
//             [name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc,sketch_overlays, special_test_desc, goal_desc, program_desc, xray_desc,xray_file,mri_desc,mri_file,ultrasound_desc,ultrasound_file,blood_report_desc,blood_report_file, patient_id]);
            
//         res.status(201).json({ message: 'Patient details updated successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

// router.post('/add-patient', async(req,res) =>{
//     try {
//         const { name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc } = req.body;

//         await pool.query('INSERT INTO patients (name,age,sex,occupation,contact_num,medical_allergies,address,other_ailments,subjective_desc,onexamination_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
//             [name, age, sex, occupation, contact_num, medical_allergies, address, other_ailments, subjective_desc, onexamination_desc]);
            
//         res.status(201).json({ message: 'Patient details updated successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// })


module.exports = router
