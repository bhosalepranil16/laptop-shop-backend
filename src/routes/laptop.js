const fs = require("fs");

const express = require("express");
const router = express.Router();

const Laptop = require("../db/models/laptop");
const isOwner = require("../middlerwares/owner");

const upload = require("../multerConfiguration");

router.get("/api/laptops", async (req, res) => {
	const match = {};
	if (req.query.brand) {
		match.brand = req.query.brand;
	}
	try {
		let laptops;
		if(req.query.page) {
			laptops = await Laptop.find(match, null, { skip: (req.query.page - 1) * 5, limit: 5});
		}
		else {
			laptops = await Laptop.find(match);
		}
		
		res.status(200).json({ ok: true, error: null, data: laptops });
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ ok: false, error: "Internal Server Error", data: null });
	}
});

router.get("/api/laptops/:id", async (req, res) => {
	try {
		const laptop = await Laptop.findById(req.params.id);
		if (!laptop) {
			return res
				.status(404)
				.json({ ok: false, error: "Not Found", data: null });
		}
		res.status(200).json({ ok: true, error: null, data: laptop });
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ ok: false, error: "Internal Server Error", data: null });
	}
});

router.post(
	"/api/laptops",
	isOwner,
	upload.single("laptopImage"),
	async (req, res) => {
		try {
			let laptop = new Laptop({
				...req.body,
				image: req.file.path,
			});
			laptop = await laptop.save();
			res.status(201).json({ ok: true, error: null, data: laptop });
		} catch (error) {
			console.log("error", error);
			res
				.status(500)
				.json({ ok: false, error: "Internal Server Error", data: null });
		}
	}
);

router.patch("/api/laptops/:id", isOwner, upload.single("laptopImage"), async (req, res) => {
	try {
		let laptop;
		if (req.file) {
			laptop = await Laptop.findById(req.params.id);
			if (!laptop) {
				return res
					.status(404)
					.json({ ok: false, error: "Not Found", data: null });
			}
			fs.unlink(laptop.image, async (err) => {
				if (err) {
					throw new Error(err);
				}
				laptop = await Laptop.findByIdAndUpdate(
					req.params.id,
					{ ...req.body, image: req.file.path },
					{ new: true }
				);
			});
		} else {
			laptop = await Laptop.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});
		}
		if (!laptop) {
			return res
				.status(404)
				.json({ ok: false, error: "Not Found", data: null });
		}
		res.status(200).json({ ok: true, error: null, data: laptop });
	} catch (error) {
		console.log("error", error);
		res.status(500).json({ ok: false, error: "Internal Server Error", data: null });
	}
}
);

router.delete("/api/laptops/:id", isOwner, async (req, res) => {
	try {
		const laptop = await Laptop.findById(req.params.id);
		if (!laptop) {
			return res
				.status(404)
				.json({ ok: false, error: "Not Found", data: null });
		}
		fs.unlink(laptop.image, async (err) => {
			if (err) {
				throw new Error(err);
			}
			await Laptop.deleteOne({ _id: laptop._id });
		});
		res.status(200).json({ ok: true, error: null, data: null });
	} catch (error) {
		console.log("error", error);
		res.status(500).json({ ok: false, error: "Internal Server Error", data: null });
	}
});

module.exports = router;