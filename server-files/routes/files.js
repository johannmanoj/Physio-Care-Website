const express = require('express');
const fileupload = require('express-fileupload');
const { uploadToSpaces } = require('../functions/spaces');

const router = express.Router();
router.use(fileupload());

const pool = require('../models/index');


router.post('/save-discom-file', async (req, res) => {
    try {
        const { patient_id, annotation_json } = req.body;

        if (!req.files || !req.files.dicom_file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dicomFile = req.files.dicom_file;

        const file_url = await uploadToSpaces(
            dicomFile.data,        
            dicomFile.name,        
            dicomFile.mimetype    
        );

        // Save in DB
        await pool.query(
            'INSERT INTO image_files (classification, patient_id, original_file, annotations) VALUES (?, ?, ?, ?)',
            ['dicom', patient_id, file_url, JSON.stringify(annotation_json)]
        );

        res.status(201).json({ message: 'Patient details updated successfully', file_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upload-file', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const reqFile = req.files.file;

        const fileUrl = await uploadToSpaces(
            reqFile.data,        
            reqFile.name,        
            reqFile.mimetype,
            req.body.type
        );

        res.status(201).json({
            message: 'File uploaded successfully',
            url: fileUrl,
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;