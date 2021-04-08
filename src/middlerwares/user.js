const jwt = require('jsonwebtoken');

const User = require('../db/models/user');

const isUser = async (req, res, next) => {
	try {
		let token = req.header('Authorization');
		token = token.split(' ')[1];
		const { _id } = jwt.verify(token, process.env.SECRET);
		const isMatch = await User.findById(_id);
		if (!isMatch) {
			throw new Error('unauthorized');
		}
		req.isUser = true;
		req._id = _id;
		next();
	} catch (error) {
		res.status(400).json(error);
	}
};

module.exports = isUser;
