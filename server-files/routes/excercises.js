const express = require('express')
const router = express.Router()
const pool = require('../models/index');



router.post('/create-new-exercise', async (req, res) => {
    try {
        const { name, instructions, img_1, img_2, img_3, img_4 } = req.body;

        await pool.query('INSERT INTO exercises (name,instructions,img_1,img_2,img_3,img_4) VALUES (?,?,?,?,?,?)',
            [name, instructions, img_1, img_2, img_3, img_4]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-exercise-list', async (req, res) => {
    try {
        const [user_details] = await pool.query('SELECT * FROM exercises', []);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-exercise', async (req, res) => {
    try {
        const { id, name, instructions, img_1, img_2, img_3, img_4 } = req.body

        await pool.query('UPDATE exercises SET name=?, instructions=? img_1=?, img_2=?, img_3=?, img_4=? WHERE id = ?', 
            [name, instructions, img_1, img_2, img_3, img_4, id]
        );
            
        res.status(201).json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/delete-exercise', async (req, res) => {
    try {
        const { record_id } = req.body;

        await pool.query('DELETE FROM exercises WHERE id = ?',
            [record_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})



router.post('/add-appointment-exercise', async (req, res) => {
    try {
        const { patient_id, appointment_id, exercise_name, exercise_id, reps, sets, branch_id } = req.body;

        await pool.query('INSERT INTO patient_exercises (patient_id, appointment_id, exercise_name, exercise_id, reps, sets, branch_id ) VALUES (?,?,?,?,?,?,?)',
            [patient_id, appointment_id, exercise_name, exercise_id, reps, sets, branch_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/delete-appointment-exercise', async (req, res) => {
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

router.post('/get-appointment-exercise-list', async (req, res) => {
    try {
        const { appointment_id } = req.body
        const [user_details] = await pool.query('SELECT * FROM patient_exercises WHERE appointment_id = ?', [appointment_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})


router.post('/create-new-treatment', async (req, res) => {
    try {
        const { name, rate } = req.body;

        await pool.query('INSERT INTO treatments (treatment, rate) VALUES (?,?)',
            [name, rate]);

        res.status(201).json({ message: 'Treatment created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-treatment', async (req, res) => {
    try {
        const { id, treatment, rate } = req.body

        await pool.query('UPDATE treatments SET treatment=?, rate=? WHERE id = ?', [treatment, rate, id]);

        res.status(201).json({ message: 'User details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/delete-treatment', async (req, res) => {
    try {
        const { record_id } = req.body;

        await pool.query('DELETE FROM treatments WHERE id = ?',
            [record_id]);

        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-treatments-list', async (req, res) => {
  try {
    const [treatment_details] = await pool.query('SELECT * FROM treatments', []);

    res.status(201).json({ message: 'Patient details retrieved successfully', data: treatment_details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})



//-This API is commented in the UI
router.post('/get-patient-image-files-list', async (req, res) => {
    try {
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM image_files WHERE patient_id = ?', [patient_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully', data: user_details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})





module.exports = router
