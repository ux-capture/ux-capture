import UXCapture, { VIEW_OVERRIDE_ERROR_MESSAGE } from '../src/UXCapture';
import View from '../src/View';
import ExpectedMark from '../src/ExpectedMark';

// UserTiming polyfill to override broken jsdom performance API
window.performance = require('usertiming');

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
	navigationStart: window.performance.now(),
};

// this effectively removes asynchronicity from UX.mark() which
// uses rAF->setTimeout->mark.record() chain
window.requestAnimationFrame = jest.fn(cb => cb());
window.setTimeout = jest.fn(cb => cb());

const MOCK_MEASURE_1 = 'ux-mock-measure_1';
const MOCK_MARK_1_1 = 'ux-mock-mark_1_1';
const MOCK_MARK_1_2 = 'ux-mock-mark_1_2';

const MOCK_MEASURE_2 = 'ux-mock-measure_2';
const MOCK_MEASURE_3 = 'ux-mock-measure_3';

const MOCK_MARK_MULTIPLE = 'ux-mock-mark_multiple';

const onMark = jest.fn();
const onMeasure = jest.fn();

describe('UXCapture', () => {
	describe('startView', () => {
		beforeEach(() => {
			onMark.mockClear();
			onMeasure.mockClear();
			UXCapture.create({ onMark, onMeasure });
		});
		afterEach(() => {
			UXCapture.destroy();
		});

		// not needed after WP-945
		it('must create dependencies between marks and measures', () => {
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
				},
			]);

			UXCapture.mark(MOCK_MARK_1_1);

			expect(
				window.performance
					.getEntriesByType('mark')
					.find(mark => mark.name === MOCK_MARK_1_1)
			).toBeTruthy();
		});

		it('must throw am error if no zones passed in', () => {
			expect(() => {
				UXCapture.startView();
			}).toThrow();
		});

		it('must not throw errors if empty zones list is passed in', () => {
			expect(() => {
				UXCapture.startView([]);
			}).not.toThrow();
		});

		it('should not trigger a measure when empty marks array is passed', () => {
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [],
				},
			]);

			expect(onMeasure).not.toHaveBeenCalled();
		});

		it('should throw an error if called more than once, but without startTransition', () => {
			UXCapture.startView([]);

			expect(() => {
				UXCapture.startView([]);
			}).toThrowError(VIEW_OVERRIDE_ERROR_MESSAGE);
		});
	});

	describe('create', () => {
		beforeEach(() => {
			onMark.mockClear();
			onMeasure.mockClear();
		});
		afterEach(() => {
			UXCapture.destroy();
		});

		it('Should throw an error if non-object is passed', () => {
			expect(() => {
				UXCapture.create();
			}).toThrow();
		});

		it('Should throw an error if onMark callback is not a function', () => {
			expect(() => {
				UXCapture.create({ onMark: 'not a function' });
				UXCapture.startView([
					{
						name: MOCK_MEASURE_1,
						marks: [MOCK_MARK_1_1],
					},
				]);
				UXCapture.mark(MOCK_MARK_1_1);
			}).toThrow();
		});

		it('Should throw an error if onMeasure callback is not a function', () => {
			expect(() => {
				UXCapture.create({ onMeasure: 'not a function' });
				UXCapture.startView([
					{
						name: MOCK_MEASURE_1,
						marks: [MOCK_MARK_1_1],
					},
				]);
				UXCapture.mark(MOCK_MARK_1_1);
			}).toThrow();
		});

		it('Should be able to configure onMark handler', () => {
			UXCapture.create({ onMark });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1],
				},
			]);
			UXCapture.mark(MOCK_MARK_1_1);

			expect(onMark).toHaveBeenCalledWith(MOCK_MARK_1_1);
		});

		it('Should be able to configure onMeasure handler', () => {
			UXCapture.create({ onMeasure });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1],
				},
			]);
			UXCapture.mark(MOCK_MARK_1_1);

			expect(onMeasure).toHaveBeenCalledWith(MOCK_MEASURE_1);
		});
	});

	describe('clearMarks', () => {
		it('calls ExpectedMark.destroy', () => {
			spyOn(ExpectedMark, 'destroy');
			const arg = 'foo';
			UXCapture.clearMarks(arg);
			expect(ExpectedMark.destroy).toHaveBeenCalledWith(arg);
		});
	});

	describe('mark', () => {
		beforeEach(() => {
			onMark.mockClear();
			onMeasure.mockClear();
			UXCapture.create({ onMark, onMeasure });

			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
				},
				{
					name: MOCK_MEASURE_2,
					marks: [MOCK_MARK_MULTIPLE],
				},
				{
					name: MOCK_MEASURE_3,
					marks: [MOCK_MARK_MULTIPLE],
				},
			]);
		});

		afterEach(() => {
			UXCapture.destroy();
		});

		it('must mark user timing api timeline', () => {
			UXCapture.mark(MOCK_MARK_1_1);

			expect(
				window.performance
					.getEntriesByType('mark')
					.find(mark => mark.name === MOCK_MARK_1_1)
			).toBeTruthy();
		});

		it('should trigger recording of a measure if last mark in chain', () => {
			UXCapture.mark(MOCK_MARK_1_1);
			UXCapture.mark(MOCK_MARK_1_2);

			expect(
				window.performance
					.getEntriesByType('measure')
					.find(measure => measure.name === MOCK_MEASURE_1)
			).toBeTruthy();
		});

		it("should fire a console.timeStamp if it's available", () => {
			// define console.timeStamp for testing only
			console.timeStamp = jest.fn();

			UXCapture.mark(MOCK_MARK_1_1);

			expect(console.timeStamp).toHaveBeenCalledWith(MOCK_MARK_1_1);
		});

		it('should call a custom mark callback when provided', () => {
			UXCapture.mark(MOCK_MARK_1_1);

			expect(onMark).toHaveBeenCalledWith(MOCK_MARK_1_1);
		});

		it('should contribute to multiple measures if same mark is defined for multiple zones', () => {
			UXCapture.mark(MOCK_MARK_MULTIPLE);

			expect(
				window.performance
					.getEntriesByType('measure')
					.find(measure => measure.name === MOCK_MEASURE_2)
			).toBeTruthy();

			expect(
				window.performance
					.getEntriesByType('measure')
					.find(measure => measure.name === MOCK_MEASURE_3)
			).toBeTruthy();
		});

		it('must work when called without waiting for next paint flag', () => {
			UXCapture.mark(MOCK_MARK_1_1, false);

			expect(
				window.performance
					.getEntriesByType('mark')
					.find(mark => mark.name === MOCK_MARK_1_1)
			).toBeTruthy();

			UXCapture.mark(MOCK_MARK_1_2, false);

			expect(
				window.performance
					.getEntriesByType('measure')
					.find(measure => measure.name === MOCK_MEASURE_1)
			).toBeTruthy();
		});
	});

	describe('startTransition', () => {
		beforeEach(() => {
			onMark.mockClear();
			onMeasure.mockClear();
			UXCapture.create({ onMark, onMeasure });
		});
		afterEach(() => {
			UXCapture.destroy();
		});

		it('destroys current view', () => {
			// page view
			spyOn(View.prototype, 'destroy');
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
				},
			]);

			UXCapture.startTransition();

			expect(View.prototype.destroy).toHaveBeenCalled();
		});

		// intentionally-internal behavior (not exposed to tests)
		// it('sets startMarkName to INTERACTIVE_TRANSITION_START_MARK_NAME')
		// it('sets window.performance.mark INTERACTIVE_TRANSITION_START_MARK_NAME')
	});
});
