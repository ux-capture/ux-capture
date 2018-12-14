// emulating a long-running JS event attachment, e.g. React re-hydration
setTimeout(() => {
	document.getElementById('morelink').addEventListener('click', function(e) {
		e.preventDefault();

		alert('More kittens there');
	});

	window.UXCapture.mark('ux-handler-moreclickable');
}, 300);

// mini-SPA
document.querySelector('a[href="page2.html"]').addEventListener('click', e => {
	e.preventDefault();

	// triggers initial mark
	UXCapture.startTransition();

	document.getElementById('content').innerHTML = '<i>... loading page 2 ...</i>';

	setTimeout(() => {
		// sets new view expectations
		UXCapture.startView([
			{
				name: 'ux-destination-verified',
				elements: [
					{
						marks: ['ux-text-title'],
						// CSS selector, same as () => document.querySelectorAll('h1')
						elementSelector: 'h1',
					},
				],
			},
			{
				name: 'ux-primary-content-displayed',
				elements: [
					{
						marks: ['ux-text-page2-content'],
						elementSelector: '#page2content',
					},
				],
			},
		]);

		setTimeout(() => {
			document.getElementById('content').innerHTML =
				'<p id="page2content">SPA transition to page 2 successful</p>';

			UXCapture.mark('ux-text-page2-content');
		}, 900); // 1s delay between startTransition() and Primary Content Available
	}, 100); // 100ms delay between startTransition() and startView();
});
