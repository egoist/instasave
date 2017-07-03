# Insta Save

> Download instagram photots.

## Commands

You can replace `yarn` with `npm run` here.

```bash
# build for production
yarn build

# development mode
yarn dev

# serve the bundled dist folder in production mode
yarn serve
```

## Polyfills

By default we only polyfill `window.Promise` and `Object.assign`. You can add more polyfills in `./src/polyfills.js`.

## Code splitting

As webpack supports both [dynamic import](https://webpack.js.org/guides/code-splitting-async/#dynamic-import-import-) and [`require.ensure`](https://webpack.js.org/guides/code-splitting-async/#require-ensure-) syntax, we would recommend you to stick to `require.ensure` for now because of [performance issue](https://github.com/webpack/webpack/issues/4636).

## Analyze bundle size

Run `yarn report` to get a report of bundle size which helps you:

- Realize what's really inside your bundle
- Find out what modules make up the most of it's size
- Find modules that got there by mistake
- Optimize it!

---

This project is generated from [create-vue-app](https://github.com/egoist/create-vue-app).
