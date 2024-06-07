const express = require('express');
const router = express.Router();
const userRegister = require('../user/register');
const userLogin = require('../user/login');
const getUser = require('../user/get');
const updateUser = require('../user/update');
const auth = require('../middleware/auth');

// ---------------------------- USER APIs ------------------------------------------ //

router.post('/user/register', userRegister.registerUser);
router.post('/user/login', userLogin.loginUser);
router.get('/user/:userId/profile', auth.authentication, auth.authorization, getUser.getUserProfile);
router.put('/user/:userId/profile', auth.authentication, auth.authorization, updateUser.updateUserData);

// Validating the endpoint

router.all('/*', (req, res) => { return res.status(404).send({ status: false, message: 'Page Not Found' }) });

module.exports = router;