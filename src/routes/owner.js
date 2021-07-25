const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const router = Router();

const Owner = require('../db/models/owner');

router.post('/api/owner/newOwner',async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        let owner = new Owner({
            email: req.body.email,
            password: hashedPassword
        });
        owner = await owner.save();
        res.status(201).json({ ok: true, data: {...owner._doc, password: ''}, error: null });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, data: null, error: 'Internal Server Error' });
    }
});

router.post('/api/owner/login',async(req,res) => {
    try {
        let owner = await Owner.findOne({ email : req.body.email })
        if(!owner) {
            return res.status(404).json({ ok: false, error: "Not Found", data: null });

        }
        const isMatch = await bcrypt.compare(req.body.password,owner.password);
        if(!isMatch) {
            return res.status(404).json({ ok: false, error: "Unauthenticated", data: null });
        }
        const token = jwt.sign({_id : owner._id}, process.env.SECRET);
        res.json({
            ok: true,
            data: { token: token },
            error: null
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, data: null, error: 'Internal Server Error' });
    }
});

module.exports = router;