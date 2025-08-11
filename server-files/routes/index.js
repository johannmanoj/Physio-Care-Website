const express = require('express');
const router = express.Router();

const auth = require('./auth')
const patients = require('./patients')
const users = require('./users')

router.use('/auth', auth)
router.use('/patients', patients)
router.use('/users', users)


module.exports = router;