# Strapdown.js

Strapdown.js makes it embarrassingly simple to create elegant Markdown documents. No server-side compilation required. 

This is a fork of the awesome project at http://strapdownjs.com

For more, please see:

+ http://ndossougbe.github.io/strapdown

## Contributor guide

You will need Node.js (>0.6.x) and Bower to generate the bundles. To bundle/compile the assets, issue in the project directory:

```
$ npm install
$ bower install
$ grunt
```

Other available commands are:

- `grunt watch` - refreshes the output files on where are changed.
- `grunt update-version` - updates the target folder (i.e. `v/0.4`  in the html files)
- `grunt test` - only runs the tests

Bug fixes should go in the latest version - no need to bump it. New features or anything that changes the old behavior should go into a bumped version (update **version** in `package.json`)

[1]:https://www.npmjs.org/package/coffee-script
[2]:https://www.npmjs.org/package/less