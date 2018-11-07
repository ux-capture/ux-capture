describe('ux-capture', () => {
	describe('AMD/Require JS', () => {
		it('should be available as an AMD module', () => {
			// TODO: figure out how to mock this environment
		});
	});

	describe('Node', () => {
		it('should be available as a module export', () => {
			const UXCapture = require('../src/ux-capture');
			expect(UXCapture).toBeDefined();
			expect(UXCapture.create).toBeDefined();
			expect(UXCapture.startView).toBeDefined();
			expect(UXCapture.updateView).toBeDefined();
			expect(UXCapture.startTransition).toBeDefined();
			expect(UXCapture.mark).toBeDefined();
		});
	});

	describe('Browser', () => {
		it('should be available on the window object', () => {
			// TODO: Figure out how to mock browser env
		});
	});
});
