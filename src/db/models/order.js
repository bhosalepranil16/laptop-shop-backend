const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	laptop: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Laptop',
	},
	quantity: {
		type: mongoose.Schema.Types.Number,
		required: true,
	},
	price: {
		type: mongoose.Schema.Types.Number,
		required: true,
	},
	placed: {
		type: mongoose.Schema.Types.Boolean,
	},
});

module.exports = mongoose.model('Order', orderSchema);
