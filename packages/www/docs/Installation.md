---
sidebar_position: 2
---

# Installation

## Installing package

To install Diseact, you can use npm or yarn. Run one of the following commands in your terminal:

```bash
npm install diseact
```

## Choosing a Module Bundler

You need a module bundler to use Diseact in your project.

### Babel

If you're using Babel, you can install the necessary presets and plugins with the following command:

```
npm i @babel/preset-react
```

Then, add the preset to your Babel configuration file (e.g., `.babelrc` or `babel.config.js`):

```json
{
    "presets": [
        [
            "@babel/preset-react", 
            {
                "runtime": "automatic",
                "importSource": "diseact"
            }
        ]
    ],
}
```
### Vite

Using vite, you only need a config file (`vite.config.js`):

```js
export default {
	esbuild: {
		jsx: 'automatic',
		jsxImportSource: 'diseact'
	}
}
```