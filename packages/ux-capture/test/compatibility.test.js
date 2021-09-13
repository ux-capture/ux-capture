// set up global UX object without a window
import UXCapture from '../src/UXCapture';

// this effectively removes asynchronicity from UX.mark() which
// uses rAF->setTimeout->mark.record() chain
window.requestAnimationFrame = jest.fn(cb => cb());
window.setTimeout = jest.fn(cb => cb());

const MOCK_MEASURE_1 = 'ux-mock-measure_1';
const MOCK_MARK_1_1 = 'ux-mock-mark_1_1';
const MOCK_MARK_1_2 = 'ux-mock-mark_1_2';

describe('Compatibility', () => {
	beforeAll(() => {
		UXCapture.create([
			{
				name: MOCK_MEASURE_1,
				marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
			},
		]);
	});

	it('UXCapture.mark() must not throw an error if UserTiming API is not available', () => {
		expect(() => {
			UXCapture.mark(MOCK_MARK_1_1);
		}).not.toThrow();
	});

	it('Should not throw an error when window.UXCapture is already defined', () => {
		expect(() => {
			require('../src/ux-capture');
			require('../src/ux-capture');
		}).not.toThrow();
	});
});
