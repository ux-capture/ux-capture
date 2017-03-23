# UX Capture
Browser instrumentation helper that makes it easier to capture UX speed metrics.

## Project Goals
There are multiple goals for this project, all dictated by lack of instrumentation inside human brains and lack of real rendering instrumentation of painting events in the browser (closes thing to human's eyes that we currently have).

* Capture display (e.g. paint) and interactivity (e.g. click handlers attached) events for various elements of web view (e.g. images, text, video, fonts, buttons, etc.)
* Group together multiple display events for elements of web page that represent same design/product components
* Group together multiple components to reflect various experience/perception phases that user goes through and we hope to achieve on the page
* Collect captured events and [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user") for all users using RUM (Real User Measurement) tools
* Calibrate in-browser instrumentation by recording page load video using synthetic tools and deriving same [_UX speed metrics_](#UX_speed_metrics "metrics representing speed of the human-computer interface as it is perceived by the user")
* Create uniform instrumentation for both [_page views_](#page_view "view resulting in full browser navigation and re-creation of browser DOM") and [_interactive views_](#interactive_view "view resulting in partial updates of browser DOM"), to be usable with any back-end and front-end framework

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
