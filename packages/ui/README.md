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

While running this command, the library will be built automatically, no need to run the `yarn run build` command!

### Build library

The `/dist` directory contains the portable component library, which can be imported into Vue projects.

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
- TailwindCSS for design system foundations
- [Headless UI](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-vue) for some components w/ Tailwind integration
- [Pug syntax](https://pugjs.org/api/getting-started.html) for simple component templating
- [TailwindCSS VSCode plugin](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

# Credits

- Vue 3 component library heavily based on [Wave UI](https://antoniandre.github.io/wave-ui)
- Vite setup is heavily based on [Equal](https://github.com/quatrochan/Equal/)

# Storybook w/ Webpack 5 (prerelease)

Refer to this:
https://gist.github.com/shilman/8856ea1786dcd247139b47b270912324
