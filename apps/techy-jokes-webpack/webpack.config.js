const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.externals = [
    'react-native-vector-icons',
    'react-native-safe-area-context',
  ];
  config.resolve.alias = {
    'react-native$': 'react-native-web',
  };
  config.resolve.extensions = ['.web.js', ...config.resolve.extensions];
  return config;
});
