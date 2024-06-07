const userModel = require('../model/user');
const validation = require('../validator/validation');

// ---------------------------------------- REGISTER USER ------------------------------------------------------- \\

module.exports.registerUser = async (req, res) => {
    try {

        let body = req.body;

        // first Check request body is coming or not
        if (!validation.isValidRequest(body)) return res.status(400).send({ status: false, message: 'Please provide name, email or password' });

        // check the key and value is coming into the body
        const requiredFields = validation.checkRequiredFields(['name', 'email', 'password'], body);

        // check any key is coming that the value is not coming in that key
        if (requiredFields !== true) return res.status(400).send({ status: false, message: `${requiredFields.charAt(0).toUpperCase() + requiredFields.slice(1)} is required` });

        // check name is only contain alphabets
        if (!validation.isValidName(body.name)) return res.status(400).send({ status: false, message: 'Name should contain only alphabets' })

        if (body.name.length < 2) return res.status(400).send({ status: false, message: 'Name should be greater than 2 characters'})

        if (body.name.length > 50) return res.status(400).send({ status: false, message: 'Name should be less than 50 characters'})

        // check email is coming in correct format
        if (!validation.isValidMail(body.email)) return res.status(400).send({ status: false, message: 'Email is invalid' });

        // Check Duplicate Email
        const isExistEmail = await userModel.findOne({ email: body.email }).select('email');
        if (isExistEmail) return res.status(400).send({ status: false, message: 'Email Already Exist' });

        // Validate Password    
        if (!validation.isValidPassword(body.password)) return res.status(400).send({ status: false, message: 'Password must be 8-15 characters long consisting of atleast one number, uppercase letter, lowercase letter and special character' });

        // Hash Password
        const hashPass = await validation.hashPassword(body.password);
        body.password = hashPass;

        await userModel.create(body);
        return res.status(200).send({ status: true, message: 'User created successfully' });
    }
    catch (err) {
        return res.status(400).send({ status: false, message: err.message });
    }
};
