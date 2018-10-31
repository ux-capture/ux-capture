# UX Capture

Browser instrumentation library that makes it easier to capture UX performance metrics.

<!-- TOC depthFrom:2 depthTo:6 orderedList:false updateOnSave:true withLinks:true -->

- [Project Goals](#project-goals)
- [JS library](#js-library)
  - [Usage](#usage)
  - [Sample page](#sample-page)
- [Instrumentation](#instrumentation)
  - [Individual Element Instrumentation](#individual-element-instrumentation)
    - [Image elements](#image-elements)
    - [Text without custom font](#text-without-custom-font)
    - [Event handler attachment](#event-handler-attachment)
  - [Aggregating component metrics](#aggregating-component-metrics)
  - [Aggregating experience/perception phase metrics](#aggregating-experienceperception-phase-metrics)
- [Testing results](#testing-results)
- [Glossary](#glossary)

<!-- /TOC -->

## Project Goals

There are multiple goals for this project, many dictated by the lack of real rendering instrumentation of paint events in the browser. These include:

- Capture display and interactivity events for various DOM elements (e.g. images, text, video, fonts, buttons, etc.)
- Group together multiple display events for elements of a web page that represent the same design/product components.
- Group together multiple components to reflect various phases of page load
- Collect captured events and [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user") for all users using RUM (Real User Measurement) tools
- Calibrate in-browser instrumentation by recording page load video using synthetic tools and deriving same [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user")
- Create uniform instrumentation for both [_page views_](#page_view "view resulting in full browser navigation and re-creation of browser DOM") and [_interactive views_](#interactive_view "view resulting in partial updates of browser DOM"), to be usable with any back-end and front-end framework
- Future compatibility with [Element Timing API](https://github.com/w3c/charter-webperf/issues/30) that aims at adding instrumentation directly into browser

## JS library

The intent of this library is to help developers instrument technical events (marks) on their pages and group them into "zones" that represent "phases" of page load, with each phase representing [distinct stages](#aggregating-experienceperception-phase-metrics) of user experience.

### Usage

WARNING: current version of the library is a first prototype that only works in modern browsers that support ES6 and all the necessary browser APIs, DO NOT USE IN PRODUCTION!

1. Load the library by inlining the contents of ux-capture.min.js in a <script> tag in the HTML document <head>

```js
const uxCaptureFilename = require.resolve('ux-capture/js/ux-capture.min.js');
const uxCaptureJS = fs.readFileSync(uxCaptureFilename, 'utf8');
...
render() {
    <head>
        <title>My Page</title>
        <script dangerouslySetInnerHTML={getInnerHTML(uxCaptureJS)} />
        ...
    </head>
    ...
}
```

**NOTE**: The script must be inlined. Do use a script tag with a `src` attribute. Waiting for network requests might artifically skew event timings on the page and lead to race conditions.

**NOTE**: It is important to have this code available very early on the page since we need to instrument events that happen as early as HTML parsing, so ideally in the <head>.

2. Initialize UXCapture using `UXCapture.create()`, optionally with mark and measure event handlers, e.g.

```js
    <script>
        window.UXCapture.create({
            onMark: name => console.log(‘marked’, name),
            onMeasure: name => console.log(‘measured, name),
        });
    </script>
```

Custom event handlers are useful in cases where the monitoring solution you use (e.g., NewRelic) does not support the W3C UserTiming API natively. You can then provide a custom method of recording the results.

- `onMark` - provides a custom handler to be called every time a mark is recorded with the name of the mark as the only argument
- `onMeasure` - provides a custom handler to be called every time a measure is recorded with the name of the measure as the only argument

3. At the top of the view markup, define the expected zones and corresponding marks with `UXCapture.startView()`, e.g.

```js
    <script>
        window.UXCapture.startView([
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

**NOTE**: `UXCapture.startView()` will always replace any previously-started view, so be careful to only call it once, before any of the marks are triggered within the view markup.

Each individual zone configuration object contains of zone's `name` that will be used as a name of corresponding [W3C UserTiming API `measure`](https://www.w3.org/TR/user-timing/#performancemeasure) and `marks` array of individual event name strings that zone groups together, each individual name will be used when recording corresponding events as [W3C UserTiming API `mark`](https://www.w3.org/TR/user-timing/#performancemark).

4. You can optionally update a view that has already been started and add more zones by calling `UXCapture.updateView()`.

5. Call UXCapture.mark in the HTML markup for each ‘mark’ name passed into UXCapture.startView/updateView.

``html
    <script>window.UXCapture.mark(‘ux-1’)</script>
    <img onload=”window.UXCapture.mark(‘ux-2’) … />
    ...
```

### Sample page

This repository contains a sample page that implements basic instrumentation for your reference:
https://cdn.rawgit.com/sergeychernyshev/ux-capture/master/examples/index.html

## Instrumentation

### Individual Element Instrumentation

Each element that needs to be instrumented might require multiple snippets of code injected into a page to measure several events which in turn are aggregated into element-level measurements using _element aggregation algorythm_ (can vary for different element instrumentation methods, but "latest of events" is generally a good default).

Number of snippets and exact code to be added to the page depends on the type of element being measured and must be determined experimentally or discovered in industry white papers or blogs as there is currently no direct method of instrumenting the display timings in modern browsers.

Below is the list of instrumentation methods with examples:

#### Image elements

Image tracking requires two measurements, one within the `onload` callback of the image itself and another within inline `<script>` tag directly after the image.

```javascript
<img src="hero.jpg" onload="UX.mark('ux-image-onload-logo')">
<script>UX.mark('ux-image-inline-logo')</script>
```

Element aggregation algorythm: latest of the two (`inline` and `onload`) measurements.

References:

- Steve Souders: [Hero Image Custom Metrics](https://www.stevesouders.com/blog/2015/05/12/hero-image-custom-metrics/), published on May 12, 2015

#### Text without custom font

Text that does not use a custom font can be instrumented by supplying one inline `<script>` tag directly after the text:

```javascript
<script>UX.mark("ux-text-headline");</script>
```

Element aggregation algorythm: no aggregation, just one event.

References:

- Steve Souders: [User Timing and Custom Metrics](https://speedcurve.com/blog/user-timing-and-custom-metrics/) (example 5), published on November 12, 2015

#### Event handler attachment

Some user activity requires custom JavaScript handler code to be attached to an event on the page, e.g. `click` of the button (e.g. it's only "available" when visible AND clickable). Instrumenting handler attachment is straightforward, just include the call right after handler attachment in JavaScript code.

```javascript
var button_element = document.getElementById("mybutton");
button_element.addEventListener("click", myActionHandler);
UX.mark("ux-handler-myaction");
```

Element aggregation algorythm: no aggregation, just one event.

### Aggregating component metrics

Most design components on web page consist of multiple elements, e.g. tweet contains text, name of the person tweeting and their userpic.

On this level, it is very business-specific and needs attention of a product manager and/or graphics designer to identify. It is suggested to conduct business interviews to identify the elements and to group them into components accordingly.

Most common way / algorythm to aggregate performance metrics for individual tracked elements is to take timing of the latest element that showed up and treat it as completion timing for compoment overall, but business decision can be made to track earliest element (e.g. "as long as something is visible"), although these are less common and can create more variability in measurement.

Component-level aggregation might be an advanced detail and can be skipped early on with element timings aggregated directly into experience/perception phases, but can be useful for modularity and more detailed analysis across the system.

### Aggregating experience/perception phase metrics

It is critical to group metrics into categories that are not specific to individual pages, but can be used universally across the property and just comprised of different components / elements on each page.

Well known example of such "category" is **_first meaningful paint_** which has different meaning on differeng parts of user experience, but represents a universal improvement over "first paint" [_technical metric_](#technical_performance_metrics "performance metrics that represent time spent executing various technical components of the application as opposed to metrics representing speed of the human-computer interface as it is perceived by the user").

This can be taken further to represent user's intent in more detail. Each view can be broken down into several phases which all contribute to keeping user on task and giving them best experience in terms of percieved speed.

Here are 4 phases defining parts of experience that matter to business from different perspectives:

1.  Destination verified (`ux-destination-verified`)
2.  Primary content displayed (`ux-primary-content-displayed`)
3.  Primary action available (`ux-primary-action-available`)
4.  Secondary content displayed (`ux-secondary-content-displayed`)

Each phase's component or element metrics (marks) can be combined and reported as measures:

```javascript
// assuming logo's onload event was last to fire among all element timers for this phase
performance.measure("ux-destination-verified", 0, "ux-image-onload-logo");
```

the can be then collected using RUM beacon or using synthetic testing tool like WebPageTest or [Chrome Developer Tools' Timeline tab](https://twitter.com/igrigorik/status/690636030727159808).

This is done automatically by the library and no additional instrumentation is necessary

## Testing results

To confirm that your instrumentation was successful, open your page in Chrome Developer Tools' Performance tab and hit reload to capture the timeline.

Verify that individual marks are captured as timestamps on the timeline (small vertical lines on Frames band), hovering over each should show the name used for the mark.

Also verify that measures are captured (long horizontal bars under User Timing band, starting at navigation and ending at the last mark comprizing the zone).

Note that you might need to zoom in on the timeline to see these marks and measures.
![Chrome DevTools Performance Timeline with marks and measures](docs/basic-results-sample-chromedevtools.png)

You can also run W3C Performance Timeline API [`performance.getEntriesByType()`](https://www.w3.org/TR/performance-timeline-2/#extensions-to-the-performance-interface) method with `"mark"` and `"measure"` parameters to retrieve marks and measures respectively.

![Chrome DevTools console showing captured performance marks and measures](docs/basic-results-sample-chromedevtools-console.png)

## Glossary

<dl>
  <dt id="technical_performance_metrics">technical performance metrics</dt>
  <dd>performance metrics that represent time spent executing various technical components of the application, common examples are: TTFB (time to first byte), DOMContentLoaded, page load, but also custom metrics representing loading of particular component of execution of particular part of the code. There are metrics clearly defined by specifications as well as metrics simply perceived by community as standard, but having multiple meanings depending on person's understanding of technology stack</dd>

  <dt id="UX_speed_metrics">UX (user experience) speed metrics</dt>
  <dd>metrics representing speed of the human-computer interface as it is perceived by the user</dd>

  <dt>view</dt>
  <dd>phase of page rendering following user interaction</dd>

  <dt id="page_view">page view</dt>
  <dd>view resulting in full browser navigation and re-creation of browser DOM (technical performance metrics are captured using W3C Navigation Timing API)</dd>

  <dt id="interactive_view">interactive view</dt>
  <dd>view resulting in partial updates of browser DOM, method used in so-called "single-page application" or just as interactive part of more traditional pages, e.g. multi-step forms, etc. Custom instrumentation is required, metrics can be captured using W3C User Timing API</dd>

</dl>
