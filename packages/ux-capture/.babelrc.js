module.exports = {
	presets: [
		'@babel/preset-react',
		['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
	],
	plugins: [
		'@babel/plugin-transform-flow-strip-types',
		'@babel/plugin-proposal-class-properties',
	],
};
