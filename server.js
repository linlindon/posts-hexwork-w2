const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const headers = require('./headers');
const errorHandler = require('./errorHandler');
const successHandler = require('./successHandler');
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
			successHandler(res, '取得所有 posts 成功', data);
		} catch (err) {
			errorHandler(res, err);
		}
	} else if (req.url === '/posts' && req.method === 'POST') {
		req.on('end', async() => {
			try {
				const data = JSON.parse(body);
				const newPost = await Post.create(data);
				successHandler(res, '新增 post 成功', newPost);
			} catch(err) {
				errorHandler(res, err);
			}
		})
		
	} else if (req.url === '/posts' && req.method === 'DELETE') {
		try {
			const deletePosts = await Post.deleteMany();
			successHandler(res, '刪除所有 posts 成功', deletePosts);
		} catch(err) {
			errorHandler(res, err);
		}
	} else if (req.url.includes('/posts/') && req.method === 'DELETE') {
		const postId = urlParams[2];
		try {
			const deletePost = await Post.findByIdAndDelete(postId);
			successHandler(res, '刪除 post 成功', deletePost);
		} catch(err) {
			errorHandler(res, err);
		}
	} else if (req.url.includes('/posts/') && req.method === 'PATCH') {
		const postId = urlParams[2];
		
		req.on('end', async() => {
			try {
				const data = JSON.parse(body);
				const updatePost = await Post.findByIdAndUpdate(postId, data);
				successHandler(res, '更新 post 成功', updatePost);
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