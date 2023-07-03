# Reflex (app)

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on http://localhost:3000

```bash
yarn run dev
```

## Production

Build the application for production and package it with electron-builder

```bash
yarn run build
```

## Testing

### Unit tests (Vitest)
See: [vitest.config.ts](./vitest.config.ts)

```bash
yarn run test
```

### Build tests (Playwright)
NOTE: Run `yarn run build` first! Only works on Mac right now.

See: [playwright.config.ts](./playwright.config.ts)

```bash
yarn run test:build
```