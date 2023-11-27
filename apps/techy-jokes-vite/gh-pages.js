var ghpages = require('gh-pages');

ghpages.publish('../../dist/apps/techy-jokes-vite', function (err) {
  if (!err) {
    console.error(err);
  }
});
