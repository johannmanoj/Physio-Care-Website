const express = require('express');
const router = express.Router();
const player_db = require('../models/players')

router.post('/get-appointment-list', async (req,res) => {
    try{
        const queryResult = await player_db.getAllAppointments ()

        if(queryResult.statusCode != 200) {
            throw {
                isCustomError: true,
                statusCode: queryResult.statusCode,
                errorName: queryResult.errorName,
                errorMsg: queryResult.errorMsg
            };
        }
        res.status(queryResult.statusCode).send(queryResult);
    }catch(err) {
        if(err.isCustomError) {
            res.status(err.statusCode).send({statusCode: err.statusCode, errorName: err.errorName, errorMsg: err.errorMsg})
        } else {
            res.status(500).send({statusCode: 500, errorName: err.name, errorMsg: err.message});
        }
    }
})

router.post('/get-patient-list', async (req,res) => {
    try{
        const queryResult = await player_db.getAllPatients ()

        if(queryResult.statusCode != 200) {
            throw {
                isCustomError: true,
                statusCode: queryResult.statusCode,
                errorName: queryResult.errorName,
                errorMsg: queryResult.errorMsg
            };
        }
        res.status(queryResult.statusCode).send(queryResult);
    }catch(err) {
        if(err.isCustomError) {
            res.status(err.statusCode).send({statusCode: err.statusCode, errorName: err.errorName, errorMsg: err.errorMsg})
        } else {
            res.status(500).send({statusCode: 500, errorName: err.name, errorMsg: err.message});
        }
    }
})

router.post('/get-patient-info', async (req,res) => {
    try{
        const {patient_id} = req.body
        const queryResult = await player_db.getPatientInfo (patient_id)
        
        if(queryResult.statusCode != 200) {
            throw {
                isCustomError: true,
                statusCode: queryResult.statusCode,
                errorName: queryResult.errorName,
                errorMsg: queryResult.errorMsg
            };
        }
        res.status(queryResult.statusCode).send(queryResult);
    }catch(err) {
        if(err.isCustomError) {
            res.status(err.statusCode).send({statusCode: err.statusCode, errorName: err.errorName, errorMsg: err.errorMsg})
        } else {
            res.status(500).send({statusCode: 500, errorName: err.name, errorMsg: err.message});
        }
    }
})

module.exports = router;