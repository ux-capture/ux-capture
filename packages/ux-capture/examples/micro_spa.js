// emulating a long-running JS event attachment, e.g. React re-hydration
setTimeout(() => {
	const morelink = document.getElementById('morelink');
	morelink.style.color = 'blue';
	morelink.addEventListener('click', function (e) {
		e.preventDefault();

		alert('More kittens there');
	});

	UXCapture.mark('ux-handler-moreclickable');
}, 500);

// mini-SPA
setTimeout(() => {
	const page2link = document.querySelector('#page2link');
	page2link.style.color = 'blue';
	page2link.addEventListener('click', e => {
		e.preventDefault();

		// triggers initial mark
		UXCapture.startTransition();

		document.getElementById('content').innerHTML =
			'<i>... loading page 2 ...</i>';

		setTimeout(() => {
			// sets new view expectations
			UXCapture.startView([
				{
					name: 'ux-destination-verified',
					elements: [
						{
							label: "Page Title",
							selector: "h1",
							marks: ['ux-text-title'],
						}
					]
				},
				{
					name: 'ux-primary-content-displayed',
					elements: [
						{
							label: "Page 2 content",
							selector: "#page2content",
							marks: ['ux-text-page2-content'],
						}
					]
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
