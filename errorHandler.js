const headers = require('./headers');

const errorHandler = (res, err) => {
	res.writeHead(400, headers);
	res.write(JSON.stringify({
		"status": "error",
		"message": err.message
	}));

	res.end()
}

module.exports = errorHandler;