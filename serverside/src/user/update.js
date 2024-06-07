const userModel = require('../model/user');
const validation = require('../validator/validation');

// ---------------------------------------- UPDATE USER ------------------------------------------------------- \\

module.exports.updateUserData = async (req, res) => {
    try {

        const { userId } = req.params;
        let body = req.body;

        if (!validation.isValidId(userId)) return res.status(400).send({ status: false, message: 'Please enter valid User id' });

        if (!validation.isValidRequest(body)) return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide update data' });

        // if user does not exist
        let userDetails = await userModel.findById(userId);
        if (!userDetails) return res.status(404).send({ status: false, message: 'User does not exist' });

        // Name check
        if (body.hasOwnProperty('name')) {
            if (!validation.isValidName(body.name)) return res.status(400).send({ status: false, message: 'Name should contain only alphabets' })
            if (body.name.length < 2) return res.status(400).send({ status: false, message: 'Name should be greater than 2 characters' })
            if (body.name.length > 50) return res.status(400).send({ status: false, message: 'Name should be less than 50 characters' })
        }

        // Email check
        if (body.hasOwnProperty('email')) {
            if (!validation.isValidMail(body.email)) return res.status(400).send({ status: false, message: 'Email is invalid' });
            let condition = { email: body.email, _id: { $ne: userId } };
            const isExistEmail = await userModel.findOne(condition).select(['_id', 'email']);
            if (isExistEmail) return res.status(400).send({ status: false, message: `${isExistEmail.email} Already used with other User` });
        }

        // password check
        if (body.hasOwnProperty('password')) {
            if (!validation.isValidPassword(body.password)) return res.status(400).send({ status: false, message: 'Password must be 8-15 characters long consisting of atleast one number, uppercase letter, lowercase letter and special character' });
            const hashPass = await validation.hashPassword(body.password);
            body.password = hashPass;
        }

        await userModel.findOneAndUpdate({ _id: userId }, body, { new: true });
        return res.status(200).send({ status: true, message: 'User profile updated'});
    } catch (err) {
        return res.status(400).send({ status: false, message: err.message });
    }
};