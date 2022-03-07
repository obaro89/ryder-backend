const jwt = require('jsonwebtoken');


export const verifyToken = async token => {
	try {
		let userId = jwt.verify(token, 'dispatch-rider');
		return userId;
	} catch (error) {
		console.log(error);
	}
};
