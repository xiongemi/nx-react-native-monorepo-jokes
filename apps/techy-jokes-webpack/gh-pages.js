var ghpages = require('gh-pages');

ghpages.publish('../../dist/apps/techy-jokes-reactpack', function (err) {
  if (!err) {
    console.error(err);
  }
});
