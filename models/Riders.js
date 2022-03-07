const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RiderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: Number,
			length: 11,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minlength: 6,
		},
		photo: {
			type: Buffer,
		},

		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

RiderSchema.methods.setPassword = async function (pwd) {
	if (pwd.length >= 6) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(pwd, salt);
	} else {
		throw new Error('Password should have at least 6 characters');
	}
};

module.exports = mongoose.model('rider', RiderSchema);
