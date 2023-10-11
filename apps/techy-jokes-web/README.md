# How to setup web app with react-native-web?

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
In terminal output, select vite as bundler:
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

In apps/techy-jokes-web/vite.config.ts, add below alias:

```
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
```

Then that is it, I can now view the web app using `npx nx serve <web app name>`.

---

## Troubleshooting

### react-native-vector-icons
Because I use react-native-vector-icons, I got this error:
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

First, I need to add files with `.web` to the extensions (the order of the extension in the array actually matters):

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
So my web app's index.html, I need to add:
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
Now build command (`nx run <web app name>`) should work.

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
  cacheDir: '../../node_modules/.vite/techy-jokes-web',
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