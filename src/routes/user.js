const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isUser = require('../middlerwares/user');

const User = require('../db/models/user');

router.get('/api/users/me', isUser, async (req, res) => {
	try {
		const user = await User.findById(req._id);
		if (!user) {
			return res.status(404).json({ ok: false, error: "Not Found", data: null });
		}
		res.status(200).json({ ok: true, data: { ...user._doc, password: '' }, error: null });
	} catch (error) {
		console.log(error);
		res.status(500).json({ ok: false, data: null, error: 'Internal Server Error' });
	}

});

router.post('/api/users/newUser', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 8);
		let user = new User({
			...req.body,
			password: hashedPassword,
		});
		user = await user.save();
		res.status(201).json({ ok: true, data: {...user._doc, password: ''}, error: null });
	} catch (error) {
		console.log(error);
		res.status(500).json({ ok: false, data: null, error: 'Internal Server Error' });
	}

});

router.post('/api/users/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(404).json({ ok: false, error: "Invalid Credentials", data: null });
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch) {
			res.status(404).json({ ok: false, error: "Invalid Credentials", data: null });
		}
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
		res.status(200).json({
			ok: true,
			data: { token: token},
			error: false
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ ok: false, data: null, error: 'Internal Server Error' });
	}
});

module.exports = router;
