# How to setup web app with react-native-web?

## Installation

First, install following packages:
- react-native-web
- react-native-svg-web

```
# npm
npm install react-native-web react-native-svg-web --save-dev

# yarn
yarn add react-native-web react-native-svg-web --dev

# pnpm
pnpm add react-native-web react-native-svg-web --save-dev
```

## Create a React App in the Monorepo

Run command:
```
npx nx g @nx/react:app <web app name>
```

In this example, it uses vite as bundler:
```
npx nx g @nx/react:app techy-jokes-web

>  NX  Generating @nx/react:application

✔ Which stylesheet format would you like to use? · none
✔ Would you like to add React Router to this application? (y/N) · false
✔ Which E2E test runner would you like to use? · none
✔ Which bundler do you want to use to build the application? · vite
✔ What should be the project name and where should it be generated? · techy-jokes-web @ apps/techy-jokes-web
```

## Import the Native Components
In the web app, in `apps/techy-jokes-web/src/main.tsx`, change the import of App to:

```
// eslint-disable-next-line @nx/enforce-module-boundaries
import App from '../../techy-jokes/src/app/App';
```

Also, in `apps/techy-jokes-web/project.json`, add `implicitDependencies`:
```
  "implicitDependencies": ["techy-jokes"]
```

## Add Alias in vite.config.ts

In apps/techy-jokes-web/vite.config.ts, add below alias:

```
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    },
  },
```

---
Then that is it, you can now view the web app using `npx nx serve techy-jokes-web`.