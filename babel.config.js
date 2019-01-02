module.exports = {
	presets: [
		'@babel/preset-react',
		['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
		'@babel/preset-flow',
	],
	plugins: ['@babel/plugin-proposal-class-properties'],
};
