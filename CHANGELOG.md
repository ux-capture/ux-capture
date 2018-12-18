## [4.0]

-   **BREAKING CHANGE**: _Removed_ `UXCapture.clearExpectedMarks` in favor of
    `UXCapture.clearMarks()`
-   **New feature** `UXCapture.clearMarks()` to imperatively clear all marks, or
    an individual mark that has already been recorded
-   **New feature** `UXCapture.destroy()` to clean up existing UXCapture data
-   Implementation update: mostly ES5 implementation to minimize overhead in
    transpiled bundle size

## [3.0.0] (November 7, 2018)

-   **BREAKING CHANGE** Upgrade to new UXCapture api spec.
-   Module renamed from `UX` to `UXCapture`.
-   `UX.config()` renamed to `UXCapture.create()`
-   `UX.expect()` renamed to `UXCapture.startView()`
-   Added support for `UXCapture.updateView()`
-   Added support for `ExpectedMark.clearExpectedMarks`
-   Update unit tests.
-   Move sample code to root /examples directory.
-   Move generated library JS to root /lib directory.

## [2.0.0] (October 9, 2018)

-   **BREAKING CHANGE**: updated expected zone configuration to use `name` instead
    of `label` as key to align with timing API conventions. Update your expect calls.
-   Now using webpack for bundling. No more source file to use, make sure to inline
    `js/ux-capture.min.js` file in your HTML.
-   Fixed a bug with hanging measures if mark is used in multiple places.
-   Replaced Promises with callbacks internally to simplify testing and allow for
    more complex logic in the future.
