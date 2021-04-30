# UX Capture React Bindings

The [UX Capture Library](../ux-capture) is a browser instrumentation library that makes it easier to capture UX Speed metrics. In order to make the library easy and effective to use in React-based applications, this module implements a set of React Bindings (Components).

- [`<UXCaptureCreate />`](#uxcapturecreate-)
- [`<UXCaptureStartView />`](#uxcapturestartview-)
- [`<UXCaptureInlineMark />`](#uxcaptureinlinemark-)
- [`<UXCaptureImageLoad />`](#uxcaptureimageload-)
- [`<UXCaptureInteractiveMark />`](#uxcaptureinteractivemark-)
- [`<UXCaptureFont />`](#uxcapturefont-)

## `<UXCaptureCreate />`

This React component implements `UXCapture.create()`, which initializes the global `window.UXCapture` singleton object. This should only ever be used once per page load.

Usage:

```jsx
const onMark = (mark: string) => {
// implement a callback that gets triggered
// each time that a mark is recorded
};

const onMeasure = (measure: string) => {
// implement a callback that gets triggered
// each time a measure is recorded
};

...
render() {
...
    <UXCaptureCreate
        onMark={onMark}
        onMeasure={onMeasure}
    />
}
```

## `<UXCaptureStartView />`

This React component implements `UXCapture.startView()`, which creates a new `View` that manages its corresponding `Zones`. If called more than once, it will replace previous `View`s.

Usage:

```jsx
<UXCaptureStartView
	destinationVerified={['ux-mark-header-logo', 'ux-mark-page-title']}
	primaryContentDisplayed={['ux-mark-0']}
	primaryActionAvailable={['ux-mark-1']}
	secondaryContentDisplayed={['ux-mark-2']}
/>
```

## `<UXCaptureInlineMark />`

This React component injects into the rendered markup an inline script tag that calls `UXCapture.mark()`.

Usage:

```jsx
...
render() {
    ...
    <h2>Hero Title</h2>
    <UXCaptureInlineMark mark="ux-text-hero-title" />
    ...
}
```

## `<UXCaptureImageLoad />`

This React component injects into the rendered markup an `<img>` tag with an onload attribute that calls `UXCapture.mark()`.

> When you use this component, make sure to include a corresponding `<UXCaptureInlineMark />` below it as well to indicate when image tag is inserted into the DOM.

Usage:

```jsx
render() {
    ...
    <UXCaptureImageLoad
        mark="ux-image-onload-script-logo"
        src={scriptLogo},
        alt={logo.logoAccessible},
        height='44px',
    />
    <UXCaptureInlineMark mark="ux-image-inline-script-logo" />
}
```

## `<UXCaptureInteractiveMark />`

This React component calls `UXCapture.mark()` within it's `componentDidMount` lifecycle method, thus only performing the mark in the browser and not in server-side render. It wall pass through and render all children.

This component should be used when simply rendering the component is not sufficient to consider the component 'ready for interaction', e.g. buttons that require the client application to be hydrated and running in order to handle click callbacks.

Usage:

```jsx
render() {
    ...
    <UXCaptureInteractiveMark mark="ux-handler-stripe">
    <Stripe>
        ...
    </Stripe>
    </UXCaptureInteractiveMark>
}
```

## `<UXCaptureFont />`

Before using UXCaptureFont component, make sure the page also includes `fontLoaderInlineCode` which inlines [Web Font Loader library](https://github.com/typekit/webfontloader) on the page.

It is most likely that you will include this code in global app container component as your fonts are loaded globally using CSS. Then just add the marks to zones next to the marks for individual text nodes, make sure to check which specific variation of the font is used by particular text element. See [font variation description docs](https://github.com/typekit/fvd) for details about variation notation used in fontFamily props below, e.g. after colon in "Fancy Font:**n4**".

```jsx
import UXCaptureFont, { fontLoaderInlineCode } from '@ux-capture/react-ux-capture/UXCaptureFont';
...

render() {
    const head = (
        <Helmet>
        ...

        <script>{fontLoaderInlineCode}</script>
        </Helmet>
    );
    ...

    return (
        <PageWrap head={head} ... >
        <UXCaptureFont
                fontFamily="Fancy Font:n4"
                mark="ux-font-fancy-font-regular-400"
            />
        <UXCaptureFont
                fontFamily="Fancy Font:n5"
                mark="ux-font-fancy-font-medium-500"
            />
        <UXCaptureFont
                fontFamily="Fancy Font:n6"
                mark="ux-font-fancy-font-semibold-600"
            />
        {children}
        </PageWrap>
        ...
    );
}

```
