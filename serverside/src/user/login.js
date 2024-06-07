const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validation = require('../validator/validation');

// ---------------------------------------- LOGIN USER ------------------------------------------------------- \\

module.exports.loginUser = async (req, res) => {
    try {

        let body = req.body;

        // first Check request body is coming or not
        if (!validation.isValidRequest(body)) return res.status(400).send({ status: false, message: 'Please provide email or password' });

        // check the key and value is coming into the body
        const requiredFields = validation.checkRequiredFields(['email', 'password'], body);

        // check any key is coming that the value is not coming in that key
        if (requiredFields !== true) return res.status(400).send({ status: false, message: `${requiredFields.charAt(0).toUpperCase() + requiredFields.slice(1)} is required` });

        // Check Email and password is Present in DB
        let user = await userModel.findOne({ email: body.email }).select(['email', 'password']);

        if (!user) return res.status(400).send({ status: false, message: 'User not exist'});

        // User password compare with the body password
        if (!(await bcrypt.compare(body.password, user.password))) return res.status(401).send({ status: false, message: 'Invalid login Credentials' });

        // Generate Token
        let token = jwt.sign({ userId: user._id.toString(), iat: new Date().getTime() / 1000 },
            process.env.SUPERSECRET, // it is secret key
            { expiresIn: '1h' }
        );

        // send response to  user is successfully logged in
        return res.status(200).send({ status: true, message: 'User login successfully', data: { userId: user._id, token: token } });
    }
    catch (err) {
        return res.status(400).send({ status: false, message: 'Something went wrong', error: err.message });
    }
};