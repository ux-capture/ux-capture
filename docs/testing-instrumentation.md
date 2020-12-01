# Testing UX Capture Instrumentation

Once [UX Capture React bindings](../packages/react-ux-capture/README.md) or [core JS library instrumentation](../packages/ux-capture/README.md) have been added to a route or feature, use these steps to view and evaluate the results in Chrome Devtools.

## Step-by-step guide

These steps can be used either in dev or prod:

1. Navigate to your page that contains the UXCapture instrumentation. Open Chrome DevTools Elements tab and delete `<head>` and `<body>` tags to keep the URL, but make the page empty. This will help show empty frames at the beginning of image capture in the next step.

2. Switch to **Performance Tab**. Click the **Reload** button so that Chrome Devtools begins profiling.

![Reload the page in profiler](testing-instrumentation/Reload.png)

3. While the profiling is happening, you'll see a progress bar in DevTools and the page will reload/refresh itself. This step may take several seconds. See screenshot.

![Profiling progress indicator](testing-instrumentation/Profiling.png)

4. Once the profile is loaded, there are **three main sections** to focus on for UXCapture: **Frames**, **Timings** and **Main** (Thread). It's easier to collapse frames section (and rely on detail view) but expand Timings and Main Thread sections one at a time because they all occupy quite a lot of space and become hard to scroll between when all are expanded. See screenshot:

![Profiler sections to pay attention to](testing-instrumentation/ChromeDevToolsPerfPanels.png)

5. Expand the **User Timing** section to see all of the zones defined in the page reported as [Browser Performance Measures](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API#Performance_measures) - specifically `ux-destination-verified`, `ux-primary-content-displayed`, `ux-primary-action-available` and `ux-secondary-content-displayed`. If you didn't define one of the zones (e.g. there is no secondary content), then you will not see a corresponding measure for it in this section.

> Measures are recorded once all the corresponding marks for that zone have been recorded. If a mark is missing/not recorded, you won't see the measure either.

6. **Hover** over each of the measure labels to see the corresponding time at which that measure was recorded. See screenshot.

![Hovering over the measure](testing-instrumentation/MeasureHover.png)

7. Collapse **Timings** section and expand **Main Thread** section. Press `Cmd+F` on Mac or `Ctrl+F` on Windows to search for each mark name. Marks are represented as **Timestamps** on the timeline and you will see the name of timestamp record found and a **total number of found entries displayed**, click on the arrows to switch between items or just press **Enter key** with will cycle between all the results.

> Note that due to some bug in current version of Chrome DevTools, search results return twice the amount of entries and one every other entry is actually highlighted by **blue border** on the flame chart.

You can zoom in and out of the timeline using mouse scroll button to better see individual marks, just make sure to zoom back out when you search as search is scoped to the zoomed in area only.

![Searching for marks](testing-instrumentation/marks_search.png)

8. Find a frame that was displayed when mark was recorded and make sure that this is the correct moment when mark is supposed to fire, e.g. text you expected to see is actually displayed in **current frame OR the frame immediately following the current frame**. You can press Shift to show a vertical blue line across all sections to help pinpoint the frame that corresponds to the recorded mark.

> Keep in mind that marks that correspond to attaching event handlers will not have visual representation on the timeline. It is common however for them to correspond to React rehydration cycle which can be visible due to change in other elements.

If you see significant discrepancies between marks timestamps and frames in which functionality you are trying to instrument is showing up, check if you picked the right instrumentation method (e.g. inline mark instead of interactive mark).

![Mark highlight and blue line](testing-instrumentation/mark_highlight_and_blue_line.png)
![Corresponding frame](testing-instrumentation/corresponding_frame.png)
![previous frame](testing-instrumentation/previous_frame.png)

9. Don't forget that text display also depends on availability of the custom fonts used on the site. Good implementations rely on `font-display` CSS property to change the behavior of custom fonts so they progressively enhance fonts once they load and it can be hard to see when it happens in the screenshots and can be tempting to discard during testing. However it is still important to test if fonts are displayed to users properly and zones/plases are only considered complete when text is visible.

> When adding UX Capture React Bindings or instrumenting using core JS library to a page or feature in dev, Chrome DevTools is the best way to verify that you have correctly implemented the marks and measures. If you see missing marks or measures in the performance profile, chances are there's a bug in the implementation.
