# Using react-native-web with Webpack in a Nx monorepo

This blog shows how to add a web app using [react-native-web](https://necolas.github.io/react-native-web/) with Webpack as the bundler in a Nx monorepo.

Github Repo: https://github.com/xiongemi/nx-react-native-monorepo-jokes

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
    ...config.resolve?.alias ?? {},
    'react-native$': 'react-native-web',
  };
```

## Change index.html to be full height

In the index.html, change the:
- `style="height: 100%"` to html tag
- `style="height:100%"` to body tag
- `style="display: flex; height:100%"` to div with root id

These style changes are taken from https://necolas.github.io/react-native-web/docs/rendering/#client-api.

So the index.html would look like:
```
<!DOCTYPE html>
<html lang="en" style="height: 100%">
  <head>
    ...
  </head>
  <body style="height: 100%">
    <div id="root" style="display: flex; height: 100%"></div>
  </body>
</html>
```
## Troubleshooting

### react-native-vector-icons
Because I use [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons/), I got this error:
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
I copy the font file from react-native-vector-icons library to the src/assets folder: https://github.com/oblador/react-native-vector-icons/tree/master/Fonts.
So in my web app's index.html, I need to add:
```
    <style type="text/css">
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/assets/MaterialCommunityIcons.ttf') format('truetype');
      }
    </style>
```

Now build command (`nx build <web app name>`) should work.

---
The final `webpack.config.js` would look like:
```
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.resolve.alias = {
    ...config.resolve?.alias ?? {},
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

The final `index.html` would look like:
```
<!DOCTYPE html>
<html lang="en" style="height: 100%">
  <head>
    <meta charset="utf-8" />
    <title>Techy Jokes Webpack</title>
    <base href="/" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <style type="text/css">
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/assets/MaterialCommunityIcons.ttf') format('truetype');
      }
    </style>
  </head>
  <body style="height: 100%">
    <div id="root" style="display: flex; height: 100vh"></div>
  </body>
</html>
```

---
## Deploy to GitHub Pages

[GitHub Pages](https://pages.github.com/) is designed to host your personal, organization, or project pages from a GitHub repository.

To deploy this web app to GitHub page:
- Install [`gh-pages`](https://github.com/tschaub/gh-pages)
```
# npm
npm install gh-pages --save-dev

# yarn
yarn add gh-pages --dev

# pnpm
pnpm add gh-pages --save-dev
```

- Create a script called `gh-pages.js` under the app:
```
var ghpages = require('gh-pages');

ghpages.publish('<relative path to app build output path>', function (err) {
  if (!err) {
    console.error(err);
  }
});
```

For this example, the `gh-pages.js` look like:
```
var ghpages = require('gh-pages');

ghpages.publish('../../dist/apps/techy-jokes-webpack', function (err) {
  if (!err) {
    console.error(err);
  }
});
```

- If your GitHub has a base href, run the build command with `--baseHref`. For example, my GitHub page is at https://xiongemi.github.io/nx-react-native-monorepo-jokes/, to build for it, the command is `nx build techy-jokes-webpack --baseHref=/nx-react-native-monorepo-jokes/`.

- Add a target in project.json:
```
    "gh-pages": {
      "command": "npx nx build <app name> --base=<app base href> --prod && node gh-pages.js",
      "cwd": "{projectRoot}"
    },
```

For this example, the target would be:
```
    "gh-pages": {
      "command": "npx nx build techy-jokes-webpack --prod --baseHref=/nx-react-native-monorepo-jokes && node gh-pages.js",
      "cwd": "{projectRoot}"
    },
```

Now you can run the command `nx gh-pages <your app name>` to deploy your app to GitHub Pages.

---
## Nx Graph

If you run command `nx graph`, you should see the web app implict depends on the react native mobile app:


![nx dependency graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tcdbru3zwq12aaech5wn.png)