const jwt = require('jsonwebtoken');
const Owner = require('../db/models/owner');

const isOwner = async(req, res, next) => {
    try {
        let token = req.header('Authorization');
        token = token.split(' ')[1];
        const { _id } = jwt.verify(token, process.env.SECRET);
        const isMatch = await Owner.findById(_id);
        if(!isMatch) {
            throw new Error('unauthorized');
        }
        req.isOwner = true;
        req._id = _id;
        next();
    } catch (error) {
        res.status(400).json(error);
    }
        
}

module.exports = isOwner;