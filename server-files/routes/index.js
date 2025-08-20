const express = require('express');
const router = express.Router();

const auth = require('./auth')
const patients = require('./patients')
const users = require('./users')
const files = require('./files')
const images = require('./images')
const appointments = require('./appointments')

router.use('/auth', auth)
router.use('/patients', patients)
router.use('/users', users)
router.use('/files',files)
router.use('/images',images)
router.use('/appointments',appointments)


module.exports = router;