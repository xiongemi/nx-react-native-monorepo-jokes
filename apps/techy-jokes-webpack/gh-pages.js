var ghpages = require('gh-pages');

ghpages.publish('../../dist/apps/techy-jokes-webpack', function (err) {
  if (!err) {
    console.error(err);
  }
});
