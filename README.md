# UX Capture
Browser instrumentation helper that makes it easier to capture UX speed metrics.

## Goals
There are multiple goals for this project, all dictated by lack of instrumentation inside human brains and lack of real rendering instrumentation of painting events in the browser (closes thing to human's eyes that we currently have).

* Capture display (e.g. paint) events for various elements of web view (e.g. images, text, video, fonts, etc.)
* Group together multiple display events for elements of web page that represent same design/product components
* Group together multiple components to reflect various experience/perception phases that user goes through and we hope to achieve on the p

## Glossary
<dl>
  <dt>view</dt>
  <dd>phase of page rendering following user interaction</dd>

  <dt>page view</dt>
  <dd>view resulting in full browser navigation and re-creation of browser DOM (technical performance metrics are captured using W3C Navigation Timing API)</dd>

  <dt>interactive view</dt>
  <dd>view resulting in partial updates of browser DOM, method used in so-called "single-page application" or just as interactive part of more traditional pages, e.g. multi-step forms, etc. Custom instrumentation is required, metrics can be captured using W3C User Timing API</dd>

  <dt>technical performance metrics</dt>
  <dd>performance metrics that represent time spent executing various technical components of the application, common examples are: TTFB (time to first byte), DOMContentLoaded, page load, but also custom metrics representing loading of particular component of execution of particular part of the code. There are metrics clearly defined by specifications as well as metrics simply perceived by community as standard, but having multiple meanings depending on person's understanding of technology stack</dd>

  <dt>UX (user experience) speed metrics</dt>
  <dd>metrics representing speed of the human-computer interface as it is perceived by the user</dd>
</dl>
