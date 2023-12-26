const {User} = require('../db/index');

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    let username = req.headers.username;
    let password = req.headers.password;

    try {
        const user = await User.findOne({ 'username': username, 'password': password });
        if(!user){
            return res.status(401).send('Unauthorized user');
        } 
    } catch (error) {
        return res.status(500).json({"msg": `Error occured, ${error}`});
    }
    next();
}

module.exports = userMiddleware;