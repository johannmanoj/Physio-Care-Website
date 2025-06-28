const express = require('express');
const router = express.Router();
const players = require('./players')


router.use('/players', players)



module.exports = router;