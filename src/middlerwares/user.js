const jwt = require('jsonwebtoken');

const User = require('../db/models/user');

const isUser = async (req, res, next) => {
	try {
		let token = req.header('Authorization');
		token = token.split(' ')[1];
		const { _id } = jwt.verify(token, process.env.SECRET);
		const isMatch = await User.findById(_id);
		if (!isMatch) {
			return res.status(500).json({ ok: false, error: "Unauthenticated", data: null });
		}
		req.isUser = true;
		req._id = _id;
		next();
	} catch (error) {
		console.log("error", error);
		res.status(500).json({ ok: false, error: "Internal Server Error", data: null });
	}
};

module.exports = isUser;
