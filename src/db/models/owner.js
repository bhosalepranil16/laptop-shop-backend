const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
	email: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	password: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
});

module.exports = mongoose.model('Owner', ownerSchema);
