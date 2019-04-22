# narrative-utils
Utility modules and APIs and such for the Jupyterlab Narrative


This is all written in TypeScript for the Shiny New KBase-UI. It's packaged and stored on NPM in the @kbase namespace.


# Installation for other modules
```
> npm install @kbase/narrative-utils
```

# Testing
1. Fetch this repo.
```
> git clone https://github.com/kbaseIncubator/narrative-utils
> cd narrative-utils
```
2. Build it
```
> npm install
```
3. Run the tests
```
> npm run test
```

# Contributing

### Adding code
All the code is under `src/` in various `.ts` (TypeScript) modules. When adding a new module or function, be sure that it is included in `index.ts` as an `export` statement, as that's the main entrypoint.

This is (currently) meant to be a catchall utility module for the new Narrative-Jupyterlab interface. It might eventually be broken down into sub-utilities, or more specialized things. For now, though, anything goes. Just decompose as logic dictates.

Be sure to run `npm run build` and `npm run test` occcasionally to test your stuff!

### Testing
Each added module should be accompanied by tests. This uses Mocha as the test runner and Chai as the runner language. All test specs are included under `test/`. They're expected to run in a Node environment. If your module expects some browser features, you might need to add those to the test runner. See `test/authSpec.js` for an example of using `jsdom` to dummy up a `window` and `document` feature.
