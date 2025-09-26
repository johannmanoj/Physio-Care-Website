const express = require('express')
const router = express.Router()

const pool = require('../models/index');


router.post('/add-image-record', async(req,res) =>{
    try {
        const { classification,patient_id,original_file,annotations,title, branch_id } = req.body;

        await pool.query('INSERT INTO image_files (classification,patient_id,original_file,annotations,title, branch_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [classification,patient_id,original_file,annotations,title, branch_id]);
            
        res.status(201).json({ message: 'Patient details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-images-title-list', async(req,res) =>{
    try {
        const {patient_id, classification, branch_id} = req.body
        const [image_details] = await pool.query('SELECT title FROM image_files WHERE patient_id=? AND classification = ? AND branch_id = ?', [patient_id, classification, branch_id]);

        var titles_list = []

        image_details.map((image)=>{
            titles_list.push(image.title)
        })
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:titles_list});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-images-details', async(req,res) =>{
    try {
        const {patient_id, classification, title, branch_id} = req.body
        const [image_details] = await pool.query('SELECT * FROM image_files WHERE patient_id=? AND classification = ? AND title = ? AND branch_id = ?', [patient_id, classification, title, branch_id]);

        res.status(201).json({ message: 'Patient details retrieved successfully' , data:image_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-images-details', async(req,res) =>{
    try {
        const {id, annotations, title} = req.body;

        await pool.query('UPDATE image_files SET title=?, annotations=? WHERE id = ?', 
            [title, annotations, id]);
            
        res.status(201).json({ message: 'Image updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router