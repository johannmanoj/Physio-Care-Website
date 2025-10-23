const express = require('express');
const router = express.Router();
const pool = require('../models/index');


router.post('/add-new-appointment', async (req, res) => {
    try {
        const { practitioner, patient_id, date, time, session_typ, onexamination_desc, branch_id } = req.body;
        const status = "Upcoming"
        const pymt_status = "Not Billed"
        const pymt_method = "None"

        await pool.query('INSERT INTO appointments (practitioner, patient_id, date, time, session_type, status, onexamination_desc, branch_id, pymt_status, pymt_method ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [practitioner, patient_id, date, time, session_typ, status, onexamination_desc, branch_id, pymt_status, pymt_method]);

        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

// router.post('/add-new-appointment', async (req, res) => {
//     try {
//         const { practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, onexamination_desc, branch_id } = req.body;
//         const status = "Upcoming"
//         const pymt_status = "Not Billed"
//         const pymt_method = "None"

//         await pool.query('INSERT INTO appointments (practitioner, patient_id, name, sex, age, contact_num, date, time, session_type, status, onexamination_desc, branch_id, pymt_status, pymt_method ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [practitioner, patient_id, name, sex, age, contact_num, date, time, session_typ, status, onexamination_desc, branch_id, pymt_status, pymt_method]);

//         res.status(201).json({ message: 'Patient details updated successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

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

// router.post('/get-all-appointments-list', async (req, res) => {
//     try {
//         let {
//             branch_id,
//             practitioner_id,
//             patient_id,
//             page = 1,
//             limit = 10,
//             search = '',
//             status = ''
//         } = req.body;

//         if (!branch_id) {
//             return res.status(400).json({ message: 'branch_id is required' });
//         }

//         page = parseInt(page, 10);
//         limit = parseInt(limit, 10);
//         const offset = (page - 1) * limit;

//         let query = 'SELECT * FROM appointments';
//         let countQuery = 'SELECT COUNT(*) AS total FROM appointments';
//         let conditions = [];
//         let params = [];
//         let countParams = [];

//         // --- Mandatory branch filter ---
//         conditions.push('branch_id = ?');
//         params.push(branch_id);
//         countParams.push(branch_id);

//         // --- Optional filters ---
//         if (practitioner_id) {
//             conditions.push('practitioner = ?');
//             params.push(practitioner_id);
//             countParams.push(practitioner_id);
//         }

//         if (patient_id) {
//             conditions.push('patient_id = ?');
//             params.push(patient_id);
//             countParams.push(patient_id);
//         }

//         if (status) {
//             conditions.push('status = ?');
//             params.push(status);
//             countParams.push(status);
//         }

//         if (search) {
//             conditions.push('(name LIKE ? OR session_type LIKE ?)');
//             params.push(`%${search}%`, `%${search}%`);
//             countParams.push(`%${search}%`, `%${search}%`);
//         }

//         if (conditions.length > 0) {
//             query += ' WHERE ' + conditions.join(' AND ');
//             countQuery += ' WHERE ' + conditions.join(' AND ');
//         }

//         query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
//         params.push(limit, offset);

//         const [appointments] = await pool.query(query, params);
//         const [[{ total }]] = await pool.query(countQuery, countParams);
//         const totalPages = Math.ceil(total / limit);

//         res.status(200).json({
//             success: true,
//             message: 'Appointments retrieved successfully',
//             data: appointments,
//             total,
//             currentPage: page,
//             totalPages,
//         });
//     } catch (err) {
//         console.error("Error fetching appointments:", err);
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });

router.post('/get-all-appointments-list2', async (req, res) => {
    try {
        let {
            branch_id,
            practitioner_id,
            patient_id,
            page = 1,
            limit = 10,
            search = '',
            status = ''
        } = req.body;

        if (!branch_id) {
            return res.status(400).json({ message: 'branch_id is required' });
        }

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        // 👇 Base query with JOIN
        let query = `
            SELECT 
                a.*, 
                p.patient_name AS patient_name,
                p.sex AS patient_sex,
                p.age AS patient_age,
                p.contact_num AS patient_phone,
                p.occupation AS patient_occupation,
                p.address AS patient_address,
                p.medical_allergies AS patient_medical_allergies,
                p.other_ailments AS patient_other_ailments
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
        `;

        // 👇 For count, just count appointments
        let countQuery = `
            SELECT COUNT(*) AS total
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
        `;

        let conditions = [];
        let params = [];
        let countParams = [];

        // --- Mandatory branch filter ---
        conditions.push('a.branch_id = ?');
        params.push(branch_id);
        countParams.push(branch_id);

        // --- Optional filters ---
        if (practitioner_id) {
            conditions.push('a.practitioner = ?');
            params.push(practitioner_id);
            countParams.push(practitioner_id);
        }

        if (patient_id) {
            conditions.push('a.patient_id = ?');
            params.push(patient_id);
            countParams.push(patient_id);
        }

        if (status) {
            conditions.push('a.status = ?');
            params.push(status);
            countParams.push(status);
        }

        if (search) {
            // Search across patient name and session type
            conditions.push('(p.name LIKE ? OR a.session_type LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
            countParams.push(`%${search}%`, `%${search}%`);
        }

        // --- Apply WHERE conditions ---
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // --- Order and Pagination ---
        query += ' ORDER BY a.id DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        // --- Execute both queries ---
        const [appointments] = await pool.query(query, params);
        const [[{ total }]] = await pool.query(countQuery, countParams);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: appointments,
            total,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/get-all-appointments-list', async (req, res) => {
    try {
        let {
            branch_id,
            practitioner_id,
            patient_id,
            page = 1,
            limit = 10,
            search = '',
            status = ''
        } = req.body;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        // ✅ Use your confirmed working JOIN
        let baseQuery = `
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
        `;

        let query = `
            SELECT 
                a.*, 
                p.patient_name AS patient_name,
                p.sex AS patient_sex,
                p.age AS patient_age,
                p.contact_num AS patient_phone,
                p.occupation AS patient_occupation,
                p.address AS patient_address,
                p.medical_allergies AS patient_medical_allergies,
                p.other_ailments AS patient_other_ailments
            ${baseQuery}
        `;

        let countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;

        let conditions = [];
        let params = [];
        let countParams = [];

        // ✅ Only add filters if value is present and not empty/null
        if (branch_id) {
            conditions.push('a.branch_id = ?');
            params.push(branch_id);
            countParams.push(branch_id);
        }

        if (practitioner_id) {
            conditions.push('a.practitioner = ?');
            params.push(practitioner_id);
            countParams.push(practitioner_id);
        }

        if (patient_id) {
            conditions.push('a.patient_id = ?');
            params.push(patient_id);
            countParams.push(patient_id);
        }

        if (status) {
            conditions.push('a.status = ?');
            params.push(status);
            countParams.push(status);
        }

        if (search) {
            conditions.push('(p.patient_name LIKE ? OR a.session_type LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
            countParams.push(`%${search}%`, `%${search}%`);
        }

        // ✅ Apply WHERE only if there are conditions
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // ✅ Sorting and pagination
        query += ' ORDER BY a.id DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        console.log('✅ Final Query:', query);
        console.log('✅ Params:', params);

        // ✅ Execute queries
        const [appointments] = await pool.query(query, params);
        const [[{ total }]] = await pool.query(countQuery, countParams);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: appointments,
            total,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        console.error('❌ Error fetching appointments:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
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