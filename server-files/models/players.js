const {QueryTypes} = require('sequelize');
const index = require('./index');
const db = index.db

const getAllAppointments = async () => {
    try {
        const result = await db.sequelize.query(
            `SELECT * FROM cricket_db.appointments`,
            {
                type: QueryTypes.SELECT
            }
        );        
        return {
            statusCode: 200,
            data: result                
        }
    } catch(err) {
        return {
            statusCode: 500,
            errorName: err.name,
            errorMsg: err.message
        }
    }
}

const getAllPatients  = async () => {
    try {
        const result = await db.sequelize.query(
            `SELECT * FROM cricket_db.patients`,
            {
                type: QueryTypes.SELECT
            }
        );        
        return {
            statusCode: 200,
            data: result                
        }
    } catch(err) {
        return {
            statusCode: 500,
            errorName: err.name,
            errorMsg: err.message
        }
    }
}

const getPatientInfo  = async (patient_id) => {
    try {
        const result = await db.sequelize.query(
            `SELECT * FROM cricket_db.patients WHERE patient_id = ?`,
            {
                replacements: [patient_id],
                type: QueryTypes.SELECT
            }
        );        
        return {
            statusCode: 200,
            data: result                
        }
    } catch(err) {
        return {
            statusCode: 500,
            errorName: err.name,
            errorMsg: err.message
        }
    }
}

module.exports = {getAllAppointments, getAllPatients, getPatientInfo}