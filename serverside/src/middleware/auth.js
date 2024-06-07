
const jwt = require('jsonwebtoken');
const { isValidId } = require('../validator/validation');
const userModel = require('../model/user');
require('dotenv').config();

// ************************ Authentication *********************** //

module.exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // if no token found
        if (!token) return res.status(401).send({ success: false, message: 'No token provided' });

        // This is written here to avoid internal server error (if token is not present)
        token = token.split(' ')[1];

        jwt.verify(token, process.env.SUPERSECRET, { ignoreExpiration: true },
            function (error, decodedToken) {
                // if token is invalid
                if (error) return res.status(400).send({ status: false, message: 'Token is invalid' })

                // if token is valid
                if (Date.now() > (decodedToken.exp * 1000 + 60 * 60 * 1000)) return res.status(401).send({ status: false, message: 'Session Expired' });
                req.userId = decodedToken.userId;
                next();
            });
    } catch (err) {
        return res.status(400).send({ status: false, message: 'Something went wrong', error: err.message });
    }
};

// ************************ Authorization *********************** //

module.exports.authorization = async (req, res, next) => {
    try {

        // if userId is not a valid ObjectId
        if (!isValidId(req.params.userId)) return res.status(400).send({ status: false, message: `${req.params.userId} is not a valid userId` });

        // if user does not exist
        let isUserExist = await userModel.findById(req.params.userId).select(['_id', 'email', 'createdAt', 'updatedAt', 'name']);
        if (!isUserExist) return res.status(404).send({ status: false, message: 'User does not exist' });

        // Authorization
        if (req.userId !== req.params.userId) return res.status(401).send({ status: false, message: `Authorization failed, You are logged in different account` });
        req.data = isUserExist;
        next();
    } catch (err) {
        return res.status(400).send({ status: false, message: 'Something went wrong', error: err.message });
    }
};
