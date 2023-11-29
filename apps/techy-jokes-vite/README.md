# Using react-native-web with Vite in a Nx monorepo

This blog shows how to add a web app using [react-native-web](https://necolas.github.io/react-native-web/) with vite as the bundler in a Nx monorepo.

Github Repo: https://github.com/xiongemi/nx-react-native-monorepo-jokes

---

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
In the terminal output, select vite as bundler:
```
>  NX  Generating @nx/react:application

✔ Which stylesheet format would you like to use? · none
✔ Would you like to add React Router to this application? (y/N) · false
✔ Which E2E test runner would you like to use? · none
✔ Which bundler do you want to use to build the application? · vite
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

## Add Alias in vite.config.ts

In apps/techy-jokes-vite/vite.config.ts, add below alias:

```
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
```

Then that is it, I can now view the web app using `npx nx serve <web app name>`.

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
  <body style="height:100%">
    <div id="root" style="display: flex; height: 100%"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Troubleshooting

### react-native-vector-icons
Because I use [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons/), I got this error:
```
[commonjs--resolver] Unexpected token (70:8) in /Users/emily/code/tmp/nx-react-native-monorepo-jokes/node_modules/react-native-vector-icons/lib/create-icon-set.js
file: /Users/emily/code/tmp/nx-react-native-monorepo-jokes/node_modules/react-native-vector-icons/lib/create-icon-set.js:70:8
68: 
69:       return (
70:         <Text selectable={false} {...props}>
            ^
71:           {glyph}
72:           {children}

 >  NX   Unexpected token (70:8) in /Users/emily/code/tmp/nx-react-native-monorepo-jokes/node_modules/react-native-vector-icons/lib/create-icon-set.js
```
This happens because `react-native-vector-icons` contains jsx code (e.g. `<Text>`) inside `.js` file.

First, I need to add files with `.web` to the extensions (the order of the extension in the array actually matters, `.web` needs to be loaded first):

```
const extensions = [
  '.mjs',
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
];
```

Add these extensions to resolve:
```
export default defineConfig({
...

  resolve: {
    extensions,
...
```

Then inside `defineConfig`, I added to optimizeDeps to resolve js files using jsx loader:
```
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      jsx: "automatic",
      loader: { ".js": "jsx" },
    },
  },
```

When I serve up the web app, I will get this error message:
```
MaterialCommunityIcon.tsx:49 Error: Dynamic require of "react-native-vector-icons/MaterialCommunityIcons" is not supported
```

I copy the font file from react-native-vector-icons library to the public folder: https://github.com/oblador/react-native-vector-icons/tree/master/Fonts.
So in my web app's index.html, I need to add:
```
    <style type="text/css">
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/MaterialCommunityIcons.ttf') format('truetype');
      }
    </style>
```

Now the serve command (`nx serve <web app name>`) is working. However, the build command (`nx run <web app name>`) still does not work with the same error.

I created a rollup plugin:
```
const rollupPlugin = (matchers: RegExp[]) => ({
  name: 'js-in-jsx',
  load(id: string) {
    if (
      matchers.some((matcher) => matcher.test(id)) &&
      id.endsWith('.js')
    ) {
      const file = readFileSync(id, { encoding: 'utf-8' });
      return esbuild.transformSync(file, { loader: 'jsx', jsx: 'automatic' });
    }
  },
});
```

Then add this plugin to the vite config:
```
  build: {
    rollupOptions: {
      plugins: [rollupPlugin([/react-native-vector-icons/])],
    },
  },
```
Now build command (`nx build <web app name>`) should work.

### global is not defined

In the web browser, I got this error:
```
NavigationContainer.tsx:29 Uncaught ReferenceError: global is not defined
```

In vite.config.ts, add:
```
  define: {
    global: "window",
  },
```

---
The final vite.config.ts:
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';

const extensions = [
  '.mjs',
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
];

const rollupPlugin = (matchers: RegExp[]) => ({
  name: 'js-in-jsx',
  load(id: string) {
    if (matchers.some((matcher) => matcher.test(id)) && id.endsWith('.js')) {
      const file = readFileSync(id, { encoding: 'utf-8' });
      return esbuild.transformSync(file, { loader: 'jsx', jsx: 'automatic' });
    }
  },
});

export default defineConfig({
  cacheDir: '../../node_modules/.vite/techy-jokes-vite',
  define: {
    global: 'window',
  },

  resolve: {
    extensions,
    alias: {
      'react-native': 'react-native-web',
    },
  },

  build: {
    rollupOptions: {
      plugins: [rollupPlugin([/react-native-vector-icons/])],
    },
  },

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      jsx: 'automatic',
      loader: { '.js': 'jsx' },
    },
  },

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
```

The final index.html:
```
<!DOCTYPE html>
<html lang="en" style="height: 100%">
  <head>
    <meta charset="utf-8" />
    <title>Techy Jokes Web</title>
    <base href="/" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <style type="text/css">
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('/MaterialCommunityIcons.ttf') format('truetype');
      }
    </style>
  </head>
  <body style="height:100%">
    <div id="root" style="display: flex; height: 100%"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---
## Deploy to GitHub Pages

[GitHub Pages](https://pages.github.com/) is designed to host your personal, organization, or project pages from a GitHub repository.

To deploy this web app to GitHub Pages:
1. install [`gh-pages`](https://github.com/tschaub/gh-pages):
```
# npm
npm install gh-pages --save-dev

# yarn
yarn add gh-pages --dev

# pnpm
pnpm add gh-pages --save-dev
```

2. Create a script called `gh-pages.js` under the app:
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

ghpages.publish('../../dist/apps/techy-jokes-vite', function (err) {
  if (!err) {
    console.error(err);
  }
});
```

3. if your GitHub has a base href, run the build command with `--base`. For example, my GitHub page is at https://xiongemi.github.io/nx-react-native-monorepo-jokes/, to build for it, the command is `nx build techy-jokes-vite --base=/nx-react-native-monorepo-jokes/`.

4. Add a target in project.json:
```
    "gh-pages": {
      "command": "npx nx build <app name> --base=<app base href> --prod && node gh-pages.js",
      "cwd": "{projectRoot}"
    },
```

For this example, the target would be:
```
    "gh-pages": {
      "command": "npx nx build techy-jokes-vite --base=/nx-react-native-monorepo-jokes/ --prod && node gh-pages.js",
      "cwd": "{projectRoot}"
    },
```

Now you can run the command `nx gh-pages <your app name>` to deploy your app to GitHub Pages.

---
## Nx Graph

If you run command `nx graph`, you should see the web app implict depends on the react native mobile app:

![nx dependency graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zal9dcj1ag55ta6734hh.png)