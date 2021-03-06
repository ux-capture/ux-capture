// emulating a long-running JS event attachment, e.g. React re-hydration
setTimeout(() => {
	const morelink = document.getElementById('morelink');
	morelink.style.color = 'blue';
	morelink.addEventListener('click', function(e) {
		e.preventDefault();

		alert('More kittens there');
	});

	UXCapture.mark('ux-handler-moreclickable');
}, 500);

// mini-SPA
setTimeout(() => {
	const page2link = document.querySelector('a[href="page2.html"]');
	page2link.style.color = 'blue';
	page2link.addEventListener('click', e => {
		e.preventDefault();

		// triggers initial mark
		UXCapture.startTransition();

		document.getElementById('content').innerHTML =
			'<i>... loading page 2 ...</i>';

		setTimeout(() => {
			[
				'ux-text-intro',
				'ux-text-story',
				'ux-image-inline-kitten',
				'ux-image-onload-kitten',
				'ux-text-story-details-link',
				'ux-handler-moreclickable',
				'ux-text-page2',
				'ux-handler-page2-clickable',
			].map(UXCapture.clearMarks);

			// sets new view expectations
			UXCapture.startView([
				{
					name: 'ux-destination-verified',
					marks: ['ux-text-title'],
				},
				{
					name: 'ux-primary-content-displayed',
					marks: ['ux-text-page2-content'],
				},
			]);

			setTimeout(() => {
				document.getElementById('content').innerHTML =
					'<p id="page2content">SPA transition to page 2 successful</p>';

				UXCapture.mark('ux-text-page2-content');
			}, 900); // 1s delay between startTransition() and Primary Content Available
		}, 100); // 100ms delay between startTransition() and startView();
	});

	UXCapture.mark('ux-handler-page2-clickable');
}, 1000);
