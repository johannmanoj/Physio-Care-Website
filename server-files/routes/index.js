const express = require('express');
const router = express.Router();

const auth = require('./auth')
const patients = require('./patients')
const users = require('./users')
const files = require('./files')

router.use('/auth', auth)
router.use('/patients', patients)
router.use('/users', users)
router.use('/files',files)


module.exports = router;