const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const headers = require('./headers')

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
	.then(() => {
		console.log('DB connection successful');
	})
	.catch((err) => {
		console.log('DB connection failed', err);
	})

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