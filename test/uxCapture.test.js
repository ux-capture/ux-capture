import UXCapture from '../js/src/UXCapture';

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

// using console.timeStamp for testing only
console.timeStamp = jest.fn();

const MOCK_MEASURE_1 = 'ux-mock-measure_1';
const MOCK_MARK_1_1 = 'ux-mock-mark_1_1';
const MOCK_MARK_1_2 = 'ux-mock-mark_1_2';

const MOCK_MEASURE_2 = 'ux-mock-measure_2';
const MOCK_MARK_2_1 = 'ux-mock-mark_2_1';

const MOCK_MEASURE_3 = 'ux-mock-measure_3';
const MOCK_MARK_3_1 = 'ux-mock-mark_3_1';

const MOCK_MEASURE_4 = 'ux-mock-measure_3';
const MOCK_MARK_4_1 = 'ux-mock-mark_3_1';

const onMark = jest.fn();
const onMeasure = jest.fn();

describe('UXCapture', () => {
	describe('startView', () => {
		beforeAll(() => {
			UXCapture.create({
				onMark,
				onMeasure,
			});
		});

		afterAll(() => {
			onMark.mockClear();
			onMeasure.mockClear();
		});

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
						name: MOCK_MEASURE_2,
						marks: [MOCK_MARK_2_1],
					},
				]);
				UXCapture.mark(MOCK_MARK_2_1);
			}).toThrow();
		});

		it('Should be able to configure onMark handler', () => {
			UXCapture.create({ onMark });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_3,
					marks: [MOCK_MARK_3_1],
				},
			]);
			UXCapture.mark(MOCK_MARK_3_1);

			expect(onMark).toHaveBeenCalledWith(MOCK_MARK_3_1);
		});

		it('Should be able to configure onMeasure handler', () => {
			UXCapture.create({ onMeasure });
			UXCapture.startView([
				{
					name: MOCK_MEASURE_4,
					marks: [MOCK_MARK_4_1],
				},
			]);
			UXCapture.mark(MOCK_MARK_4_1);

			expect(onMeasure).toHaveBeenCalledWith(MOCK_MEASURE_4);
		});
	});
});
