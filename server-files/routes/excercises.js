const express = require('express')
const router = express.Router()
const pool = require('../models/index');

router.post('/get-exercise-list', async(req,res) =>{
    try {
        const [user_details] = await pool.query('SELECT * FROM exercises', []);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})


router.post('/create-new-exercise', async(req,res) =>{
    try {
        const { name,instructions,img_1,img_2,img_3,img_4  } = req.body;
        console.log("name", req.body);
        

        await pool.query('INSERT INTO exercises (name,instructions,img_1,img_2,img_3,img_4) VALUES (?,?,?,?,?,?)', 
            [name,instructions,img_1,img_2,img_3,img_4]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-appointment-exercise-list', async(req,res) =>{
    try {
        const {appointment_id} = req.body
        const [user_details] = await pool.query('SELECT * FROM patient_exercises WHERE appointment_id = ?', [appointment_id]);
        
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})


router.post('/add-new-exercise', async(req,res) =>{
    try {
        const { patient_id, appointment_id, exercise_name, exercise_id, reps, sets } = req.body;
   
        await pool.query('INSERT INTO patient_exercises (patient_id, appointment_id, exercise_name, exercise_id, reps, sets ) VALUES (?,?,?,?,?,?)', 
            [patient_id, appointment_id, exercise_name, exercise_id, reps, sets ]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/delete-appointment-exercise', async(req,res) =>{
    try {
        const { record_id } = req.body;
        
        await pool.query('DELETE FROM patient_exercises WHERE id = ?', 
            [record_id]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
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
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM image_files WHERE patient_id = ?', [patient_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})





module.exports = router
