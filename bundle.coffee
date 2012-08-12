#!/usr/bin/env coffee
require 'shelljs/global'

buildDir = 'assets'

if not test '-d', buildDir
  mkdir '-p', buildDir

# JS
bundle = ''
bundle += (cat 'vendor/marked.min.js') + '\n'
bundle += (cat 'vendor/prettify.min.js') + '\n'
bundle += (cat 'src/strapdown.js') + '\n'
bundle.to buildDir + '/strapdown.js'

console.log "Bundles generated in #{buildDir}/"
