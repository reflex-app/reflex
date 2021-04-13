# Reflex UI

The user interface elements powering the Reflex app.

Components are state-less, and "dumb" by design. Logic is handled separately by the Reflex project.

## Usage

```bash
$ yarn add @reflex/ui -D
```

### Nuxt.js

Create a new plugin file:

```bash
import Vue from 'vue'
import ReflexUI from '@reflex/ui'

Vue.use(ReflexUI)
```

Add the plugin to the `plugins: [{ src: '~/plugins/reflex-ui.js', ssr: false }]` in your `nuxt.config.js`

## Setup

### Install

```bash
yarn install
```

### UI Development

```bash
yarn run storybook
```

### Build library

NOTE: This is a work-in-progress. The idea is that this `/ui` folder will export a portable component library which will be imported by the Reflex project.

```bash
yarn run build
```

## Notes

- Component namespacing: `<rfx-{component-name}/>`

## Contributing

We are happy to accept accessibility and bug fixes via PRs.

## Stack

- Vue 3 as front-end framework
- Vite for lightning-fast Vue builds
- StoryBook for UI experimentation

# Credits

The Vite setup is heavily based on [Equal](https://github.com/quatrochan/Equal/)
