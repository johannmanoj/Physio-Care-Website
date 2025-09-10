const express = require('express');
const router = express.Router();
const pool = require('../models/index');
const bcrypt = require('bcrypt');


router.post('/get-users-list', async(req,res) =>{
    try {
        const [user_details] = await pool.query('SELECT * FROM users', []);
        console.log("user_details",user_details);
        
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-user-details', async(req,res) =>{
    try {
        const {user_id} = req.body
        const [user_details] = await pool.query('SELECT * FROM users WHERE id =?', [user_id]);     
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/get-custom-users-list', async(req,res) =>{
    try {
        const {role} = req.body
        console.log("---------", req.body);
        
        const [user_details] = await pool.query(`SELECT * FROM users WHERE role = ?`, [role]);
        console.log("user_details",user_details);
        
       
        res.status(201).json({ message: 'Patient details retrieved successfully' , data:user_details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/add-user', async(req,res) =>{
    try {
        const {email, name, password, role} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (email,name, password, role) VALUES (?, ?, ?, ?)', [email,name, hashedPassword,role]);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-user', async(req,res) =>{
    try {
        const {id,email,password,role,name,phone,dob,joining_date,leaving_date,monthly_salary,pf,tax,bank_name,acc_holder_name,acc_number,ifsc_code} = req.body
        
        await pool.query('UPDATE users SET email=?,password=?,role=?,name=?,phone=?,dob=?,joining_date=?,leaving_date=?,monthly_salary=?,pf=?,tax=?,bank_name=?,acc_holder_name=?,acc_number=?,ifsc_code=? WHERE id = ?', [email,password,role,name,phone,dob,joining_date,leaving_date,monthly_salary,pf,tax,bank_name,acc_holder_name,acc_number,ifsc_code,id]);
       
        res.status(201).json({ message: 'User details updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-user-profile', async(req,res) =>{
    try {
        const {id, name, email, phone, bank_name, acc_holder_name, acc_number, ifsc_code} = req.body
        
        await pool.query('UPDATE users SET email=?, name=?, phone=?, bank_name=?, acc_holder_name=?, acc_number=?, ifsc_code=? WHERE id = ?', [email,name, phone,bank_name, acc_holder_name, acc_number, ifsc_code, id]);
        
        res.status(201).json({ message: 'User details updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-user-attendance', async(req,res) =>{
    try {
        const {id, attendance} = req.body
        
        await pool.query('UPDATE users SET attendance=? WHERE id = ?', [attendance, id]);
        
        res.status(201).json({ message: 'User details updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-user-working-days', async(req,res) =>{
    try {
        const {id, monthly_working_days} = req.body
        
        await pool.query('UPDATE users SET monthly_working_days=? WHERE id = ?', [monthly_working_days, id]);
        
        res.status(201).json({ message: 'User details updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/change-password', async (req, res) => {
    try {
        const { user_id, currentpass, newpassword, confirmpassword} = req.body;
        const [user_details] = await pool.query('SELECT password FROM users WHERE id =?', [user_id]);

        // check if old password is correct
        const isLoggedIn = await bcrypt.compare(currentpass, user_details[0]['password']).then(function(result) {
            return result;
        })

        if(isLoggedIn == false) {
            throw {
                isCustomError: true,
                statusCode: 402,
                errName: "Old Password mismatch",
                errMsg: "Old password and entered password doesn't match."
            }
        }
        
        if(newpassword !== confirmpassword) {
            throw {
                isCustomError: true,
                statusCode: 401,
                errName: "Password mismatch",
                errMsg: "New password and confirm password doesn't match."
            }
        } 

        var salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(newpassword, salt);
        await pool.query('UPDATE users SET password=? WHERE id = ?', [hashedPassword, user_id]);
        
        res.status(201).json({ message: 'User details updated successfully'});
    } catch(error) {
        if(error.isCustomError) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(error.status).json(error.message);
        }
    }
});

module.exports = router;