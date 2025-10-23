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

router.post('/get-all-patients-list', async (req, res) => {
    try {
        const { branch_id, page = 1, limit = 10, search = '' } = req.body;

        // ✅ Ensure integers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        // ✅ Prepare search query
        const searchQuery = `%${search.trim()}%`;

        // ✅ 1. Fetch paginated records
        const [records] = await pool.query(
            `SELECT * FROM patients WHERE branch_id = ? AND (patient_name LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?`,
            [branch_id, searchQuery, limitNum, offset]
        );

        // ✅ 2. Get total count for pagination
        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) AS total FROM patients WHERE branch_id = ? AND (patient_name LIKE ?)`,
            [branch_id, searchQuery]
        );

        // ✅ 3. Calculate total pages
        const totalPages = Math.ceil(total / limitNum);

        // ✅ 4. Send response
        res.status(200).json({
            success: true,
            message: 'Patient records fetched successfully',
            data: records,
            total,
            currentPage: pageNum,
            totalPages,
        });

    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient records',
            error: error.message,
        });
    }
});


router.post('/get-patient-details', async(req,res) =>{
    try {
        const { patient_id } = req.body;

        const [user_details] = await pool.query('SELECT * FROM patients WHERE id = ?', [patient_id]);
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-patient-details', async (req, res) => {
    try {
        const { id, patient_name,sex,age,contact_num,occupation,address,medical_allergies,other_ailments } = req.body

        await pool.query('UPDATE patients SET patient_name=? ,sex=? ,age=? ,contact_num=? ,occupation=? ,address=? ,medical_allergies=? ,other_ailments=? WHERE id = ?', 
            [patient_name,sex,age,contact_num,occupation,address,medical_allergies,other_ailments, id]
        );
            
        res.status(201).json({ message: 'User details updated successfully' });
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
