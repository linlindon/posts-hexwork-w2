const headers = require('./headers');

const successHandler = (res, message, data) => {
	res.writeHead(200, headers);
	res.write(JSON.stringify({
		"status": "success",
		"message": message || '',
		"data": data
	}));
	res.end();
};

module.exports = successHandler;