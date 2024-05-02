const HttpController = require('../controllers/http');
const postsController = require('../controllers/posts');
const errorHandler = require('../service/errorHandler');
const successHandler = require('../service/successHandler');
const Post = require('../models/posts');
const posts = require('../controllers/posts');

const routes = async(req, res) => {
	const { url, method } = req;
	const urlParams = url.split('/');
	let body = '';
	req.on('data', chunk => {
		body += chunk;
	})
	if (url === '/posts' && method === 'GET') {
		postsController.getPosts(res);
	} else if (url === '/posts' && method === 'POST') {
		req.on('end', () =>  postsController.createPosts({body, req, res}))
	} else if (url === '/posts' && method === 'DELETE') {
		postsController.deleteAllPosts(res);
	} else if (url.includes('/posts/') && method === 'DELETE') {
		const postId = urlParams[2];
		postsController.deletePost({res, postId});
	} else if (url.includes('/posts/') && method === 'PATCH') {
		const postId = urlParams[2];
		req.on('end', async () => {
			postsController.updatePost({res, postId, body});
		});
	} else if (method === 'OPTIONS') {
		HttpController.cors(req, res);
	}
	else {
		HttpController.notFound(req, res);
	}
};

module.exports = routes;
