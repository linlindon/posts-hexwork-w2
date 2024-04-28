const http = require('http');

const headers = require('./headers')

const requestListener = (req, res) => {
	if (req.url === '/') {
		res.writeHead(200, headers);
		res.write("hello world");
		res.end();
	} else {
		res.writeHead(404, headers);
		res.write("Page not found");
		res.end();
	}
};

const server = http.createServer(requestListener);
server.listen(3000);