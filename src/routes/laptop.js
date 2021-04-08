const fs = require('fs');

const express = require('express');
const router = express.Router();

const Laptop = require('../db/models/laptop');
const isOwner = require('../middlerwares/owner');

const upload = require('../multerConfiguration');

router.get('/laptops/allLaptops', async(req,res) => {
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

router.get('/laptops/getLaptop/:id', async(req,res) => {
    try {
        const laptop =  await Laptop.findById(req.params.id);
        if(!laptop) {
            return res.status(404).send();
        }
        res.json(laptop);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/laptops/addLaptop', isOwner, upload.single('laptopImage'),async(req, res) => {
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

router.patch('/laptops/updateLaptop/:id', isOwner, upload.single('laptopImage'),async(req,res) => {
    try {
        let laptop;
        if(req.file) {
            laptop = await Laptop.findById(req.params.id);
            if(!laptop) {
                return res.sendStatus(404);
            }
            fs.unlink(laptop.image, async(err) => {
                if(err) {
                    throw new Error(err);
                }
                laptop = await Laptop.findByIdAndUpdate(req.params.id,{ ...req.body, image: req.file.path }, {new : true});
            });
        }
        else {
            laptop = await Laptop.findByIdAndUpdate(req.params.id,req.body, {new : true});
        }
        if(!laptop) {
            return res.sendStatus(404);
        }
        res.status(200).json(laptop);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete('/laptops/deleteLaptop/:id', isOwner, async(req,res) => {
    try {
        const laptop = await Laptop.findById(req.params.id);
        if(!laptop) {
            return res.status(404).send();
        }
        fs.unlink(laptop.image, async(err) => {
            if(err) {
                throw new Error(err);
            }
            await Laptop.deleteOne({_id : laptop._id});
        });
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;