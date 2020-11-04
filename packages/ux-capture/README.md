# UX Capture JavaScript Library

Browser instrumentation JavaScript library that makes it easier to capture UX performance
metrics using [UX Capture](../../README.md) approach

- [Usage](#usage)
- [Sample page](#sample-page)
- [Instrumentation](#instrumentation)
  - [Image elements](#image-elements)
  - [Text without custom font](#text-without-custom-font)
  - [Text with custom font](#text-with-custom-font)
  - [Event handler attachment](#event-handler-attachment)
- [UX Capture Lifecycle](#ux-capture-lifecycle)

The intent of this library is to help developers instrument technical events
(marks) on their pages and group them into "zones" that represent "phases" of page
load, with each phase representing [distinct stages](#aggregating-experienceperception-phase-metrics)
of user experience.

React bindings for this library exists as a separate module [@meetup/react-ux-capture](../react-ux-capture/)

## Usage

**NOTE:** this version of the library relies on `UserTiming API` to be available
in the browser, but should not break if it doesn't. You can
[use a polyfill](https://www.npmjs.com/package/usertiming) if you want to support older browsers.

1. Load the library by inlining the contents of ux-capture.min.js in a `<script>`
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

2. Initialize UXCapture using `UXCapture.create()`, optionally with mark and
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

    - `onMark` - provides a custom handler to be called every time a mark is recorded
      with the name of the mark as the only argument
    - `onMeasure` - provides a custom handler to be called every time a measure is
      recorded with the name of the measure as the only argument

3. At the top of the view markup, define the expected zones and corresponding
   marks with `UXCapture.startView()`, e.g.

    ```jsx
        <script>
            UXCapture.startView([
                {
                    name: 'ux-destination-verified',
                    marks: ['ux-1', 'ux-2']
                },{
                    name: 'ux-primary-content-available',
                    marks: ['ux-3', 'ux-4']
                }
                ...
            ]);
        </script>
    ```

    **NOTE**: `UXCapture.startView()` will throw an error if called while previous
    view is active, so be careful to only call it once.

    Each individual zone configuration object contains of zone's `name` that will be
    used as a name of corresponding
    [W3C UserTiming API `measure`](https://www.w3.org/TR/user-timing/#performancemeasure)
    and `marks` array of individual event name strings that zone groups together,
    each individual name will be used when recording corresponding events as
    [W3C UserTiming API `mark`](https://www.w3.org/TR/user-timing/#performancemark).

4. You can optionally update a view that has already been started and add more
   zones by calling `UXCapture.updateView()`.

5. Call UXCapture.mark in the HTML markup for each ‘mark’ name passed into
   `UXCapture.startView()`/`updateView()`.

    ```jsx
        <script>UXCapture.mark('ux-1')</script>
        <img onload="UXCapture.mark('ux-2')" … />
        ...
    ```

6. (SPA support) For 'interactive' view changes (usually associated with a route
   change), the client app must imperatively indicate when the current view is
   no longer valid using `UXCapture.startTransition`, and clear any marks that
   should not be considered valid for the subsequent view using
   `UXCapture.clearMarks(name)`. To clear all marks, omit the name argument. Do not clear
   marks that are associated with elements that do not change between views.

    The call to `UXCapture.startTransition` does not need to be in the markup (and generally shouldn’t be).

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

    Summary: A SPA view transition is comprised of the following calls:

    1. `UXCapture.startTransition()` – required
    2. `UXCapture.clearMarks(name)` – optional, but should be called for each existing mark that is no longer valid

7. Repeat from step 3.

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

## UX Capture Lifecycle

You can review full lifecycle of user experience, marks, measures and resulting metrics on the following diagram.
![UX Capture lifecycle diagram](docs/ux-capture-lifecycle.svg)
