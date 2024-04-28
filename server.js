const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const headers = require('./headers');
const errorHandler = require('./errorHandler');
const Post = require('./models/posts');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
	.then(() => {
		console.log('DB connection successful');
	})
	.catch((err) => {
		console.log('DB connection failed', err);
	})

const requestListener = async(req, res) => {
	const urlParams = req.url.split('/');
	console.log('urlParams', urlParams);
	let body = '';
	req.on('data', chunk => {
		body += chunk;
	})
	if (req.url === '/posts' && req.method === 'GET') {
		try {
			const data = await Post.find();
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				"status": "success",
				"data": data
			}));
			res.end();
		} catch (err) {
			errorHandler(res, err);
		}
		
	} else if (req.url === '/posts' && req.method === 'POST') {
		req.on('end', async() => {
			try {
				const data = JSON.parse(body);
				await Post.create(data);

				res.writeHead(200, headers);
				res.write(JSON.stringify({
					"status": "success",
					"message": "Post created"
				}));
				res.end();
			} catch(err) {
				errorHandler(res, err);
			}
		})
		
	} else if (req.url === '/posts' && req.method === 'DELETE') {
		try {
			await Post.deleteMany();
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				"status": "success",
				"message": "All posts deleted"
			}));
		} catch(err) {
			errorHandler(res, err);
		}
	} else if (req.url.includes('/posts/') && req.method === 'DELETE') {
		const postId = urlParams[2];
		try {
			await Post.findByIdAndDelete(postId);
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				"status": "success",
				"message": "Post deleted"
			}));
			res.end();
		} catch(err) {
			errorHandler(res, err);
		}
	} else if (req.url.includes('/posts/') && req.method === 'PATCH') {
		const postId = urlParams[2];
		
		req.on('end', async() => {
			try {
				const data = JSON.parse(body);
				await Post.findByIdAndUpdate(postId, data);
				res.writeHead(200, headers);
				res.write(JSON.stringify({
					"status": "success",
					"message": "Post updated"
				}));
				res.end();
			} catch (err) {
				errorHandler(res, err);
			}
		});
	} else if (req.method === 'OPTIONS') {
		res.writeHead(200, headers);
		res.end();
	}
	else {
		res.writeHead(404, headers);
		res.write("Page not found");
		res.end();
	}
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3000);