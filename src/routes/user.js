const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isUser = require('../middlerwares/user');

const User = require('../db/models/user');

router.get('/users/me', isUser,async(req, res) => {
    const user = await User.findById(req._id);
    res.status(200).json(user);
});

router.post('/users/newUser',async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({
        ...req.body,
        password: hashedPassword
    });
    await user.save();
    res.status(201).json(user);
});

router.post('/users/login', async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        throw new Error('user not found');
    }
    const isMatch = await bcrypt.compare(req.body.password,user.password);
    if(!isMatch) {
        throw new Error('invalid credentials');
    }
    const token = jwt.sign({ _id : user._id }, process.env.SECRET);
    res.status(200).json({
        token
    });
});

module.exports = router;