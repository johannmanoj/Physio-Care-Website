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

// ✅ /api/exercises/get-exercise-list
router.post('/get-all-exercises-list', async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.body;

        const offset = (page - 1) * limit;

        // ✅ Main query with pagination and search
        let query = `
            SELECT * FROM exercises
            WHERE (name LIKE ?)
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        const params = [`%${search}%`, Number(limit), Number(offset)];

        const [exercises] = await pool.query(query, params);

        // ✅ Get total count for pagination
        const [countResult] = await pool.query(
            `
            SELECT COUNT(*) AS total FROM exercises
            WHERE (name LIKE ?)
            `,
            [`%${search}%`]
        );

        const totalExercises = countResult[0].total;

        res.status(200).json({
            message: 'Exercises fetched successfully',
            data: exercises,
            total: totalExercises,
        });
    } catch (err) {
        console.error('Error fetching exercises:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


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

router.post('/get-all-treatments-list', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    // ✅ Fetch treatments with pagination + search + optional branch filter
    const [data] = await pool.query(
      `SELECT * FROM treatments 
       WHERE (treatment LIKE ?)
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [`%${search}%`, Number(limit), Number(offset)]
    );

    // ✅ Get total count for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM treatments 
       WHERE (treatment LIKE ?)`,
      [`%${search}%`]
    );

    const total = countResult[0].total;

    res.status(200).json({
      message: 'Treatments fetched successfully',
      data,
      total,
    });

  } catch (err) {
    console.error('Error fetching treatments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




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
