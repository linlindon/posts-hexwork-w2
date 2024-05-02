const errorHandler = require('../service/errorHandler');
const successHandler = require('../service/successHandler');
const Post = require('../models/posts');

const posts = {
	async getPosts(res) {
		const data = await Post.find();
		successHandler(res, '取得所有 posts 成功', data);
	},
	async createPosts({req, res, body}) {
		try {
			const data = JSON.parse(body);
			const newPost = await Post.create(data);
			successHandler(res, '新增 post 成功', newPost);
		} catch (err) {
			errorHandler(res, err);
		}
	},
	async deleteAllPosts(res) {
		try {
			const deletePosts = await Post.deleteMany();
			successHandler(res, '刪除所有 posts 成功', deletePosts);
		} catch (err) {
			errorHandler(res, err);
		}
	},
	async deletePost({res, postId}) {
		try {
			const deletePost = await Post.findByIdAndDelete(postId);
			successHandler(res, '刪除 post 成功', deletePost);
		} catch (err) {
			errorHandler(res, err);
		}
	},
	async updatePost({res, postId, body}) {
		try {
			const data = JSON.parse(body);
			const updatePost = await Post.findByIdAndUpdate(postId, data, { runValidators: true, new: true });
			successHandler(res, '更新 post 成功', updatePost);
		} catch (err) {
			errorHandler(res, err);
		}
	}
};

module.exports = posts;