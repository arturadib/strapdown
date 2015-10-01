# Strapdown.js

Strapdown.js makes it embarrassingly simple to create elegant Markdown documents. No server-side compilation required. 

## Getting started
You can easily use the hosted version of this JavaScript library to quickly get started. 
Make an HTML file and simply add the following line before your closing HTML tag: 
  <script src="http://strapdownjs.com/v/0.2/strapdown.js"></script>
Now you can open a tag like this and put your markdown inside it
  <xmp theme="united" style="display:none;">
    # Your markdown here
  </xmp>
  
There's also a sample code on project's homepage. 
For more, please see:

+ http://strapdownjs.com

## Contributor guide

You will need Node.js (>0.6.x) and CoffeeScript to generate the bundles. To bundle/compile the assets, issue in the project directory:

```
$ npm install
$ coffee bundle <version_number>
```

Bug fixes should go in the latest version - no need to bump it. New features or anything that changes the old behavior should go into a bumped version.
