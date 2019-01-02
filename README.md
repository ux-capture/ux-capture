# UX Capture monorepo

See [Meetup Confluence docs](https://meetup.atlassian.net/wiki/spaces/WEG/pages/718700545/UX+Capture)
for more info

## Packages

### [@meetup/ux-capture](./packages/ux-capture)

Core library

### [@meetup/react-ux-capture](./packages/react-ux-capture)

React component wrappers around library API

### [@meetup/ux-capture](./packages/react-ux-capture-example)

Demo of React bindings in a simple SPA

## Publish workflow

The packages are published with independent versions, which must be updated
manually _before_ a PR is merged. Lerna will walk you through the process of
tagging new versions when you run

```
$ yarn do-version
```

The Travis deploy step will then publish _only updated packages_ when the PR
merges. If you forget to bump a version, the deploy will fail and you will have
to run `yarn do-version` to push the latest tags
