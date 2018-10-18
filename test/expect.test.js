// UserTiming polyfill to override broken jsdom performance API
window.performance = require('usertiming');

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
	navigationStart: window.performance.now(),
};

// using console.timeStamp for testing only
console.timeStamp = jest.fn();

// set up global UX object
const UXCapture = require('../js/src/ux-capture');
const UX = new UXCapture();

const MOCK_MEASURE_1 = 'ux-mock-measure_1';
const MOCK_MARK_1_1 = 'ux-mock-mark_1_1';
const MOCK_MARK_1_2 = 'ux-mock-mark_1_2';

describe('UX.expect()', () => {
	it('must create dependencies between marks and measures', () => {
		UX.expect([
			{
				name: MOCK_MEASURE_1,
				marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
			},
		]);

		// this effectively removes asynchronicity from UX.mark() which
		// uses rAF->setTimeout->mark.record() chain
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
		jest.spyOn(window, 'setTimeout').mockImplementation(cb => cb());

		UX.mark(MOCK_MARK_1_1);

		expect(
			window.performance
				.getEntriesByType('mark')
				.find(mark => mark.name === MOCK_MARK_1_1)
		).toBeTruthy();
	});

	it('must throw am error if no zones passed in', () => {
		expect(() => {
			UX.expect();
		}).toThrow();
	});

	it('must not throw errors if empty zones list is passed in', () => {
		expect(() => {
			UX.expect([]);
		}).not.toThrow();
	});

	it('should not trigger a measure when empty marks array is passed', () => {
		const mockOnMeasureCallback = jest.fn();

		UX.config({ onMeasure: mockOnMeasureCallback });

		UX.expect([
			{
				name: MOCK_MEASURE_1,
				marks: [],
			},
		]);

		expect(mockOnMeasureCallback).not.toHaveBeenCalled();
	});
});
