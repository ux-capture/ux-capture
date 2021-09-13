# UX Capture JavaScript Library

Browser instrumentation JavaScript library that makes it easier to capture UX performance
metrics using [UX Capture](../../README.md) approach

-   [Usage](#usage)
    -   [Step 1: Inline the library in the `<head>` tag](#step-1-inline-the-library-in-the-head-tag)
    -   [Step 2: Initialize the library](#step-2-initialize-the-library)
    -   [Step 3: Configure expected zones for the view](#step-3-configure-expected-zones-for-the-view)
    -   [Step 4: (optionally) Update zone configuration as page loads](#step-4-optionally-updatate-zone-configuration-as-page-loads)
    -   [Step 5: Mark individual events on the page](#step-5-mark-individual-events-on-the-page)
    -   [Step 6: SPA views / transitions (if applicable)](#step-6-spa-views--transitions-if-applicable)
        -   [Step 6A: Indicate which elements will persist or get removed](#step-6a-indicate-which-elements-will-persist-or-get-removed)
            -   [Method 1: Use Selectors](#method-1-use-selectors)
            -   [Method 2: Clear Marks for Removed Elements](#method-2-clear-marks-for-removed-elements)
    -   [Repeat](#repeat)
-   [Sample page](#sample-page)
-   [Instrumentation](#instrumentation)
    -   [Image elements](#image-elements)
    -   [Text without custom font](#text-without-custom-font)
    -   [Text with custom font](#text-with-custom-font)
    -   [Event handler attachment](#event-handler-attachment)
-   [UX Capture sequence diagram](#ux-capture-sequence-diagram)

The intent of this library is to help developers instrument technical events
(marks) on their pages and group them into "zones" that represent "phases" of page
load, with each phase representing [distinct stages](#aggregating-experienceperception-phase-metrics)
of user experience.

React bindings for this library exists as a separate module [@ux-capture/react-ux-capture](../react-ux-capture/)

## Usage

**NOTE:** this version of the library relies on `UserTiming API` to be available
in the browser, but should not break if it doesn't. You can
[use a polyfill](https://www.npmjs.com/package/usertiming) if you want to support older browsers.

### Step 1: Inline the library in the `<head>` tag

Load the library by inlining the contents of ux-capture.min.js in a `<script>`
tag in the HTML document `<head>`. Here's an example using server-side React:

```jsx
const uxCaptureFilename = require.resolve('ux-capture/lib/ux-capture.min.js');
const uxCaptureJS = fs.readFileSync(uxCaptureFilename, 'utf8');
...
render() {
    <head>
        <title>My Page</title>
        <script dangerouslySetInnerHTML={{ __html: uxCaptureJS }} />
        ...
    </head>
    ...
}
```

**NOTE**: The script must be inlined. Do not use a script tag with a `src` attribute.
Waiting for network requests might artifically skew event timings on the page
and lead to race conditions.

**NOTE**: It is important to have this code available very early on the page since
we need to instrument events that happen as early as HTML parsing, so ideally in
the `<head>`.

### Step 2: Initialize the library

Initialize UXCapture using `UXCapture.create()`, optionally with mark and
measure event handlers, e.g.

```jsx
<script>
UXCapture.create({
    onMark: name => console.log('marked', name),
    onMeasure: name => console.log('measured', name),
});
</script>
```

Custom event handlers are useful in cases where the monitoring solution you use
(e.g., NewRelic) does not support the W3C UserTiming API natively. You can then
provide a custom method of recording the results.

-   `onMark` - provides a custom handler to be called every time a mark is recorded
    with the name of the mark as the only argument
-   `onMeasure` - provides a custom handler to be called every time a measure is
    recorded with the name of the measure as the only argument

### Step 3: Configure expected zones for the view

At the top of the view markup, define the expected zones and corresponding
marks with `UXCapture.startView()`, e.g.

```jsx
<script>
UXCapture.startView([
    {
        name: 'ux-destination-verified',
        elements: [
            {
                selector: "#logo",
                marks: ['ux-1', 'ux-2']
            },
        ]
    }, {
        name: 'ux-primary-content-available',
        elements: [
            {
                selector: "#intro",
                marks: ['ux-3']
            },
            {
                selector: "a.moreinfo",
                marks: ['ux-4']
            },
        ]
    }
    ...
]);
</script>
```

**NOTE**: `UXCapture.startView()` will throw an error if called while previous
view is active, so be careful to only call it once.

Each individual zone configuration object contains of zone's `name` that will be
used as a name of corresponding [W3C UserTiming API `measure`](https://www.w3.org/TR/user-timing/#performancemeasure)
and a list of elements comprising the zone with CSS or JS function selector that returns the node
and `marks` array of individual event name strings, each individual mark name will be used
when recording corresponding events as [W3C UserTiming API `mark`](https://www.w3.org/TR/user-timing/#performancemark).

### Step 4: (optionally) Update zone configuration as page loads

You can optionally update a view that has already been started and add more
zones by calling `UXCapture.updateView()`.

### Step 5: Mark individual events on the page

Call UXCapture.mark in the HTML markup for each ‘mark’ name passed into
`UXCapture.startView()`/`updateView()`.

```jsx
<script>UXCapture.mark('ux-1')</script>
<img onload="UXCapture.mark('ux-2')" … />
...
```

### Step 6: SPA views / transitions (if applicable)

For "interactive" view changes (usually associated with a route change),
the client app must imperatively indicate when the current view is
no longer valid using `UXCapture.startTransition()` call.

```jsx
history.push(‘/foo’)
UXCapture.startTransition();
```

or, a little less controlled, using History API:

```jsx
window.onpopstate = UXCapture.startTransition;

const pushState = window.history.pushState;
window.history.pushState = (...args) => {
	UXCapture.startTransition();
	return pushState.apply(window.history, args);
};

const replaceState = window.history.replaceState;
window.history.replaceState = (...args) => {
	UXCapture.startTransition();
	return replaceState.apply(window.history, args);
};
```

`UXCapture.startTransition()` call creates additional `transitionStart` UserTiming API mark to indicate the moment user interaction happened.

All measures in this interactive view will be recorded from this moment,
rather than "natural" zero of page view's `navigationStart` provided by Navigation Timing API.

The call to `UXCapture.startTransition` does not need to be in the markup (and generally shouldn’t be).

#### Step 6A: Indicate which elements will persist or get removed

There are two methods of defining pre-existing elements on the page,
by configuring selectors for elements in the zone
or by explicitly clearing marks that correspond to these elements before next `UXCapture.startView()` is called.

If Zone is fully satisfied by pre-existing elements, it will be measured from and to `transitionStart` mark making it effectively a `0ms` long.

##### Method 1: Use Selectors

When you configure Zones and corresponding elements in `UXCapture.startView()` call (see Step 3 above), you include `selector` property for each element
which is either a CSS Selector string or a JS function that returns DOM nodes corresponding to the element.

Alternatively, you can select a `selector` attribute set to a JS function on the zone object as a whole
and it will be called for each element in the zone passing element configuration as input.

These selectors would be used to determine if element is still present on the page and UX Capture will satisfy them immediately without expecting the marks fired for them.

##### Method 2: Clear Marks for Removed Elements

Clear any marks for elements that will not be resent on the subsequent view using `UXCapture.clearMarks(name)`.
To clear all marks, omit the name argument.
Do not clear marks that are associated with elements that do not change between views.

_Note:_ This method is used by `react-ux-capture` because it fits well with React's lifecycle methods, but might be hard to maintain in other applications.

### Repeat

Repeat from the start for regular page views and from step 3 for SPA applications.

## Sample page

This repository contains a sample page that implements basic instrumentation
for your reference:
https://www.ux-capture.org/examples/

## Instrumentation

This documentation shows snippets of code using UX Capture JavaScript library, for more information on methods of individual element instrumentation, see [project page](../../#instrumentation_approach).

### Image elements

Image tracking requires two measurements, one within the `onload` callback of the image itself and another within inline `<script>` tag directly after the image.

```jsx
<img src="hero.jpg" onload="UXCapture.mark('ux-image-onload-logo')">
<script>UXCapture.mark('ux-image-inline-logo')</script>
```

### Text without custom font

Text that does not use a custom font can be instrumented by supplying one inline
`<script>` tag directly after the text:

```jsx
<h1>Headline</h1>
<script>UXCapture.mark("ux-text-headline");</script>
```

### Text with custom font

Many pages use custom fonts to display text and often experience Flash of
Invisible Text or [FOIT](https://www.zachleat.com/web/fout-vs-foit/). It is
important to take into account time to load custom fonts. You can do it using
font loaders provided by [using event tracking in Web Font Loader](https://github.com/typekit/webfontloader#events)
used by Typekit and Google.

You can inline the library in HTML and then use the following code to fire a mark
when font loaded.

```jsx
<script>
WebFont.load({
    custom: {
        families: ["Montserrat:n4"]
    },
    active: function() {
        UXCapture.mark("ux-font-montserrat-normal");
    }
});
</script>
```

**NOTE:** See [Font Variation Description](https://github.com/typekit/fvd) format used by Web Font Loader for specifying particular font variation to track.

Similarly to tracking text without custom font, inject a mark inline after text that uses custom font in question.

```jsx
<h2>Title with font</h2>
<script>UXCapture.mark("ux-text-title-using-montserrat-normal");</script>
```

### Event handler attachment

Some user activity requires custom JavaScript handler code to be attached to an
event on the page, e.g. `click` of the button (e.g. it's only "available" when
visible AND clickable). Instrumenting handler attachment is straightforward, just
include the call right after handler attachment in JavaScript code.

```jsx
var button_element = document.getElementById('mybutton');
button_element.addEventListener('click', myActionHandler);
UXCapture.mark('ux-handler-myaction');
```

## UX Capture API Specification and sequence diagram

For API specification and requirements, including sequence diagram, see [UX Capture Core Library API Spec](docs/ux-capture-js-api-spec.md) document.
