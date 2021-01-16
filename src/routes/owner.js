const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const Owner = require('../db/models/owner');

// router.post('/owner/newOwner',async(req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 8);
//         const owner = new Owner({
//             email: req.body.email,
//             password: hashedPassword
//         });
//         await owner.save();
//         res.status(201).json(owner);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

router.post('/owner/login',async(req,res) => {
    try {
        let owner = await Owner.findOne({ email : req.body.email })
        if(!owner) {
            return res.sendStatus(404);
        }
        const isMatch = await bcrypt.compare(req.body.password,owner.password);
        if(!isMatch) {
            throw new Error('Invalid Credentials');
        }
        const token = jwt.sign({_id : owner._id}, process.env.SECRET, { expiresIn : '1h' });
        res.json({
            token
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;