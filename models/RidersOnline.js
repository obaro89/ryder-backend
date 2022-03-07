const mongoose = require('mongoose');

const RiderOnlineSchema = new mongoose.Schema({
	driverID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rider',
	},
});
