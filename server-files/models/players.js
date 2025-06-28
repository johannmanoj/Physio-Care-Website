const {QueryTypes} = require('sequelize');
const index = require('./index');
const db = index.db

const getAllPlayers  = async () => {
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

module.exports = {getAllPlayers}