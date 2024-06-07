// ---------------------------------------- GET USER ------------------------------------------------------- \\

module.exports.getUserProfile = async function (req, res) {
    try {
        
        let userDetails = req.data;
        return res.status(200).send({ status: true, message: 'User profile details', data: userDetails });
    } catch (err) {
        return res.status(400).send({ status: false, message: 'Something went wrong' });
    }
};