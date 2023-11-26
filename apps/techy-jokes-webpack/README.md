# How to set up a web app with react-native-web and webpack?

## Installation
First, I need to install `react-native-web`:

```
# npm
npm install react-native-web --save-dev

# yarn
yarn add react-native-web --dev

# pnpm
pnpm add react-native-web --save-dev
```

## Add a React App in the Nx Monorepo

Run command:
```
npx nx g @nx/react:app <web app name>
```
In the terminal output, select webpack as bundler:
```
>  NX  Generating @nx/react:application

✔ Which stylesheet format would you like to use? · none
✔ Would you like to add React Router to this application? (y/N) · false
✔ Which E2E test runner would you like to use? · none
✔ Which bundler do you want to use to build the application? · webpack
```

## Import the Native App
In the web app, in `apps/<web app name>/src/main.tsx`, change the import of App to:

```
// eslint-disable-next-line @nx/enforce-module-boundaries
import App from '../../<native app name>/src/app/App';
```

Also, in web app's `project.json`, add `implicitDependencies`:
```
  "implicitDependencies": ["<native app name>"]
```

## Add Alias in webpack.config.ts

In apps/techy-jokes-webpack/webpack.config.ts, add below alias:

```
  config.resolve.alias = {
    'react-native$': 'react-native-web',
  };
```

## Change index.html to be full height

In the index.html, change the:
- `style="height: 100%"` to html tag
- `style="min-height: 100%"` to body tag
- `style="display: flex; min-height: 100vh"` to div with root id

These style changes are taken from examples in https://reactnavigation.org/docs/server-rendering.

So the index.html would look like:
```
<!DOCTYPE html>
<html lang="en" style="height: 100%">
  <head>
    ...
  </head>
  <body style="min-height: 100%">
    <div id="root" style="display: flex; min-height: 100vh"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Then that is it, I can now view the web app using `npx nx serve <web app name>`.

---

## Troubleshooting

### react-native-vector-icons
Because I use react-native-vector-icons, I got this error:
```
ERROR in ../../node_modules/react-native-vector-icons/lib/create-icon-set.js 70:8
Module parse failed: Unexpected token (70:8)
File was processed with these loaders:
 * ../../node_modules/source-map-loader/dist/cjs.js
You may need an additional loader to handle the result of these loaders.
| 
|       return (
>         <Text selectable={false} {...props}>
|           {glyph}
|           {children}

webpack compiled with 1 error (af4bf9f7c72b44dc)
```
This happens because `react-native-vector-icons` contains jsx code (e.g. `<Text>`) inside `.js` file.

First, I need to add files with `.web` to the extensions (the order of the extension in the array actually matters):

```
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    ...config.resolve.extensions,
  ];
```

Then I need to add a rule to load the `.js` file from `react-native-vector-icons` using babel loader (https://stackoverflow.com/questions/56750269/react-native-web-failed-to-compile-react-native-vector-icons):

```
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    include: /react-native-vector-icons/,
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    },
  });
```


When I serve up the web app, I will get this error message:
```
MaterialCommunityIcon.tsx:49 Error: Dynamic require of "react-native-vector-icons/MaterialCommunityIcons" is not supported
```
So my web app's index.html, I need to add:
```
    <style type="text/css">
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/MaterialCommunityIcons.ttf') format('truetype');
      }
    </style>
```

Now build command (`nx build <web app name>`) should work.


## react-native-reanimated

```
Animated: `useNativeDriver` is not supported because the native animated module is missing. Falling back to JS-based animation. To resolve this, add `RCTAnimation` module to this app, or remove `useNativeDriver`.
```

---
The final webpack.config.js:
```
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.resolve.alias = {
    'react-native$': 'react-native-web',
  };
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    ...config.resolve.extensions,
  ];
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    include: /react-native-vector-icons/,
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    },
  });
  return config;
});

```
