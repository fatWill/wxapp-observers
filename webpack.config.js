const path = require('path');

module.exports = {
	entry: ['./src/page.js', './src/component.js'],
	output: {
		filename: 'observers.js',
		// path: path.resolve(__dirname, "test/core")
		path: path.resolve(__dirname, "dist")
	},
	mode: 'production',
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: [
						'@babel/plugin-transform-runtime',
						'@babel/plugin-proposal-function-bind'
					]
				}
			}
		}]
	}
}