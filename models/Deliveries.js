const mongoose = require('mongoose');

const DevliverySchema = new mongoose.Schema(
	{
		bookingID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'booking',
		},
		rider: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'rider',
		},
		deliveryDate: {
			type: Date,
		},

		rating: {
			type: Number,
			default: 1,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('delivery', DevliverySchema);
