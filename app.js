const routes = require('./routes');

require('./connections');

const app = async(req, res) => {
	await routes(req, res);	
};

module.exports = app;

