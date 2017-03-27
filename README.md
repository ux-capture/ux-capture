# UX Capture
Browser instrumentation helper that makes it easier to capture UX speed metrics.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [UX Capture](#ux-capture)
	- [Project Goals](#project-goals)
	- [Instrumentation](#instrumentation)
		- [Individual Element Instrumentation](#individual-element-instrumentation)
			- [Image elements](#image-elements)
			- [Text without custom font](#text-without-custom-font)
			- [Event handler attachment](#event-handler-attachment)
		- [Aggregating component metrics](#aggregating-component-metrics)
		- [Aggregating experience/perception phase metrics](#aggregating-experienceperception-phase-metrics)
	- [Glossary](#glossary)

<!-- /TOC -->

## Project Goals
There are multiple goals for this project, all dictated by lack of instrumentation inside human brains and lack of real rendering instrumentation of painting events in the browser (closes thing to human's eyes that we currently have).

* Capture display (e.g. paint) and interactivity (e.g. click handlers attached) events for various elements of web view (e.g. images, text, video, fonts, buttons, etc.)
* Group together multiple display events for elements of web page that represent same design/product components
* Group together multiple components to reflect various experience/perception phases that user goes through and we hope to achieve on the page
* Collect captured events and [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user") for all users using RUM (Real User Measurement) tools
* Calibrate in-browser instrumentation by recording page load video using synthetic tools and deriving same [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user")
* Create uniform instrumentation for both [_page views_](#page_view "view resulting in full browser navigation and re-creation of browser DOM") and [_interactive views_](#interactive_view "view resulting in partial updates of browser DOM"), to be usable with any back-end and front-end framework
* Future compatibility with [Element Timing API](https://github.com/w3c/charter-webperf/issues/30) that aims at adding instrumentation directly into browser

## Instrumentation

### Individual Element Instrumentation
Each element that needs to be instrumented might require multiple snippets of code injected into a page to measure several events which in turn are aggregated into element-level measurements using _element aggregation algorythm_ (can vary for different element instrumentation methods, but "latest of events" is generally a good default).

Number of snippets and exact code to be added to the page depends on the type of element being measured and must be determined experimentally or discovered in industry white papers or blogs as there is currently no direct method of instrumenting the display timings in modern browsers.

Below is the list of instrumentation methods with examples:

#### Image elements
Image tracking requires two measurements, one within the `onload` callback of the image itself and another within inline `<script>` tag directly after the image.
```javascript
<img src="hero.jpg" onload="performance.mark('ux-image-onload-logo')">
<script>performance.mark('ux-image-inline-logo')</script>
```
Element aggregation algorythm: latest of the two (`inline` and `onload`) measurements.

References:
* Steve Souders: [Hero Image Custom Metrics](https://www.stevesouders.com/blog/2015/05/12/hero-image-custom-metrics/), published on May 12, 2015

#### Text without custom font
Text that does not use a custom font can be instrumented by supplying one inline `<script>` tag directly after the text:
```javascript
<script>
performance.mark("ux-text-headline");
</script>
```
Element aggregation algorythm: no aggregation, just one event.

References:
* Steve Souders: [User Timing and Custom Metrics](https://speedcurve.com/blog/user-timing-and-custom-metrics/) (example 5), published on November 12, 2015

#### Event handler attachment
Some user activity requires custom JavaScript handler code to be attached to an event on the page, e.g. `click` of the button (e.g. it's only "available" when visible AND clickable). Instrumenting handler attachment is straightforward, just include the call right after handler attachment in JavaScript code.
```javascript
var button_element = document.getElementById("mybutton");
button_element.addEventListener("click", myActionHandler);
performance.mark("ux-handler-myaction");
```

Element aggregation algorythm: no aggregation, just one event.

References:
* _???_

### Aggregating component metrics
Most design components on web page consist of multiple elements, e.g. tweet contains text, name of the person tweeting and their userpic.

On this level, it is very business-specific and needs attention of a product manager and/or graphics designer to identify. It is suggested to conduct business interviews to identify the elements and to group them into components accordingly.

Most common way / algorythm to aggregate performance metrics for individual tracked elements is to take timing of the latest element that showed up and treat it as completion timing for compoment overall, but business decision can be made to track earliest element (e.g. "as long as something is visible"), although these are less common and can create more variability in measurement.

Component-level aggregation might be an advanced detail and can be skipped early on with element timings aggregated directly into experience/perception phases, but can be useful for modularity and more detailed analysis across the system.

### Aggregating experience/perception phase metrics
It is critical to group metrics into categories that are not specific to individual pages, but can be used universally across the property and just comprised of different components / elements on each page.

Well known example of such "category" is ___first meaningful paint___ which has different meaning on differeng parts of user experience, but represents a universal improvement over "first paint" [_technical metric_](#technical_performance_metrics "performance metrics that represent time spent executing various technical components of the application as opposed to metrics representing speed of the human-computer interface as it is perceived by the user").

This can be taken further to represent user's intent in more detail. Each view can be broken down into several phases which all contribute to keeping user on task and giving them best experience in terms of percieved speed.

Here are 4 phases defining parts of experience that matter to business from different perspectives:
1. Destination verified (`ux-destination-verified`)
2. Primary content displayed (`ux-primary-content-displayed`)
3. Primary action available (`ux-primary-action-available`)
4. Secondary content displayed (`ux-secondary-content-displayed`)

Each phase's component or element metrics (marks) can be combined and reported as measures:
```javascript
// assuming logo's onload event was last to fire among all element timers for this phase
performance.measure('ux-destination-verified', 0, 'ux-image-onload-logo');
```
the can be then collected using RUM beacon or using synthetic testing tool like WebPageTest or [Chrome Developer Tools' Timeline tab](https://twitter.com/igrigorik/status/690636030727159808).

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
