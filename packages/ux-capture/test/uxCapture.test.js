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

// define console.timeStamp for testing only
console.timeStamp = jest.fn();

const MOCK_MEASURE_1 = 'ux-mock-measure_1';
const MOCK_MARK_1_1 = 'ux-mock-mark_1_1';
const MOCK_MARK_1_2 = 'ux-mock-mark_1_2';

const MOCK_MEASURE_2 = 'ux-mock-measure_2';
const MOCK_MEASURE_3 = 'ux-mock-measure_3';

const MOCK_MARK_MULTIPLE = 'ux-mock-mark_multiple';

const onMark = jest.fn();
const onMeasure = jest.fn();

function spyConsole() {
	// https://github.com/facebook/react/issues/7047
	let spy = {};

	beforeAll(() => {
		spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterAll(() => {
		spy.console.mockRestore();
	});

	return spy;
}

describe('UXCapture', () => {
	beforeEach(() => {
		onMark.mockClear();
		onMeasure.mockClear();
		console.timeStamp.mockClear();
		UXCapture.create({ onMark, onMeasure });
		window.performance.clearMarks();
		window.performance.clearMeasures();
	});

	afterEach(() => {
		UXCapture.destroy();
	});

	describe('startView', () => {
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

		let spy = spyConsole();

		it('should log an error if called more than once, but without startTransition', () => {
			UXCapture.startView([]);
			UXCapture.startView([]);

			expect(console.error).toHaveBeenCalled();
			expect(spy.console.mock.calls[0][0]).toEqual(VIEW_OVERRIDE_ERROR_MESSAGE);
		});
	});

	describe('create', () => {
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

		it("should not fire a console.timeStamp if it's not enabled (default)", () => {
			UXCapture.mark(MOCK_MARK_1_1);

			expect(console.timeStamp).not.toHaveBeenCalledWith(MOCK_MARK_1_1);
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

		it('must only call onMark callback once per mark even if it is used in multiple zones', () => {
			UXCapture.mark(MOCK_MARK_MULTIPLE);

			expect(onMark).toHaveBeenCalledTimes(1);
		});

		it('must call onMark the same number of times as UXCapture.mark() method calls', () => {
			UXCapture.mark(MOCK_MARK_1_1);
			UXCapture.mark(MOCK_MARK_MULTIPLE);
			UXCapture.mark(MOCK_MARK_MULTIPLE);

			expect(onMark).toHaveBeenCalledTimes(3);
		});
	});

	describe('mark with console.timeline() enabled', () => {
		beforeEach(() => {
			UXCapture.destroy();
		});

		it("should fire a console.timeStamp if it's enabled and available", () => {
			UXCapture.create({ recordTimestamps: true });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1],
				},
			]);

			UXCapture.mark(MOCK_MARK_1_1);

			expect(console.timeStamp).toHaveBeenCalledWith(MOCK_MARK_1_1);
		});

		it("should not fire a console.timeStamp if it's explicitly disabled", () => {
			UXCapture.create({ recordTimestamps: false });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1],
				},
			]);

			UXCapture.mark(MOCK_MARK_1_1);

			expect(console.timeStamp).not.toHaveBeenCalledWith(MOCK_MARK_1_1);
		});
	});

	describe('startTransition', () => {
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

		it('should not attempt to record a measure if transitionStart mark does not exist in interactive views', () => {
			UXCapture.startTransition();

			expect(
				window.performance.getEntriesByName('transitionStart').length
			).toBe(1);

			window.performance.clearMarks('transitionStart');

			expect(
				window.performance.getEntriesByName('transitionStart').length
			).toBe(0);

			UXCapture.startView([
				{
					name: MOCK_MEASURE_1,
					marks: [MOCK_MARK_1_1, MOCK_MARK_1_2],
				},
			]);

			UXCapture.mark(MOCK_MARK_1_1);

			// don't throw an exception
			// (unfortunately, does not throw with UserTiming polyfill anyway, but throws in real browsers)
			expect(() => {
				UXCapture.mark(MOCK_MARK_1_2);
			}).not.toThrow();

			// should not attempt to record a measure
			// (with UserTiming polyfill used in test it can try and record one empty startTime and duration)
			expect(
				window.performance
					.getEntriesByType('measure')
					.find(measure => measure.name === MOCK_MEASURE_1)
			).not.toBeTruthy();
		});

		// intentionally-internal behavior (not exposed to tests)
		// it('sets startMarkName to INTERACTIVE_TRANSITION_START_MARK_NAME')
		// it('sets window.performance.mark INTERACTIVE_TRANSITION_START_MARK_NAME')
	});
});
