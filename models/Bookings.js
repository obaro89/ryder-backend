const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
		pickup: {
			address: {
				type: String,
				required: true,
			},
			latitude: {
				type: Number,
			},
			longitude: {
				type: Number,
			},
		},

		dropoff: {
			receiver: {
				type: String,
				required: true,
			},
			receiverphone: {
				type: Number,
			},
			address: {
				type: String,
				required: true,
			},
			type: {
				type: String,
			},
			weight: {
				type: Number,
			},
			latitude: {
				type: Number,
			},
			longitude: {
				type: Number,
			},
		},
		amount: {
			type: Number,
		},
		rider: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'rider',
		},
		status: {
			type: String,
			default: 'Pending',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('booking', BookingSchema);
