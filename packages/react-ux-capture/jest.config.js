module.exports = {
	moduleFileExtensions: ['js', 'json', 'jsx'],
	moduleNameMapper: {
		'\\.(css|ico|inc|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/emptyString.js',
	},
	setupFiles: ['<rootDir>/util/setupTests.js'],
	snapshotSerializers: ['enzyme-to-json/serializer'],
	testPathIgnorePatterns: ['/lib'],
	testRegex: '\\.test\\.jsx?$',
};
