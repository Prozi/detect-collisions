const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './demo/index.js',

	mode: 'development',

	target: 'web',

	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title   : 'detect-collisions - for circles, polygons, and points',
		}),
	],

	output: {
		path    : `${__dirname}/docs/demo/`,
		filename: 'index.js',
	},
};
