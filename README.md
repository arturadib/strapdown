# Strapdown.js

Strapdown.js makes it embarrassingly simple to create elegant Markdown documents. No server-side compilation required. 

For more, please see:

+ http://strapdownjs.com

## Contributor guide

You will need Node.js (>0.6.x), [CoffeeScript][1] and [Less][2] to generate the bundles. To bundle/compile the assets, issue in the project directory:

```
$ npm install
$ coffee bundle <version_number>
```

Bug fixes should go in the latest version - no need to bump it. New features or anything that changes the old behavior should go into a bumped version.

[1]:https://www.npmjs.org/package/coffee-script
[2]:https://www.npmjs.org/package/less