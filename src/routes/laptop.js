const express = require('express');
const router = express.Router();
const multer = require('multer');

const Laptop = require('../db/models/laptop');
const isOwner = require('../middlerwares/owner');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },

    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + file.originalname);
    }
});
var upload = multer({storage : storage});

router.get('/laptops/allLaptops',async(req,res) => {
    const match = {};
    if(req.query.brand) {
        match.brand = req.query.brand;
    }
    try {
        const laptops = await Laptop.find(match, null, {skip: (req.query.page - 1) * 5, limit: 5 });
        res.json(laptops);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/laptops/getLaptop/:id',async(req,res) => {
    try {
        const laptop =  await Laptop.findById(req.params.id);
        if(!laptop) {
            return res.status(404).send();
        }
        res.json(laptop);
    } catch (error) {
        res.status(404).send();
    }
});

router.post('/laptops/addLaptop', upload.single('laptopImage'),async(req,res) => {
    try {
        let laptop = new Laptop({
            ...req.body,
            image: req.file.path
        });
        laptop = await laptop.save();
        res.status(201).json(laptop);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.patch('/laptops/updateLaptop/:id', isOwner,async(req,res) => {
    try {
        const laptop = await Laptop.findByIdAndUpdate(req.params.id,req.body, {new : true});
        if(!laptop) {
            return res.sendStatus(404);
        }
        res.send(laptop);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.delete('/laptops/deleteLaptop/:id', isOwner,async(req,res) => {
    try {
        const laptop = await Laptop.findByIdAndDelete(req.params.id);
        if(!laptop) {
            return res.status(404).send();
        }
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;