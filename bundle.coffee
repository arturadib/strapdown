#!/usr/bin/env coffee
require 'shelljs/global'

ver = process.argv[2]
if not ver
  echo 'You need to specify the version'
  exit 1

outDir = 'v/' + ver

if not test '-d', outDir
  mkdir '-p', outDir
else
  rm '-rf', outDir
  mkdir '-p', outDir


# JS
bundle = ''
bundle += (cat 'vendor/marked.min.js') + '\n'
bundle += (cat 'vendor/prettify.min.js') + '\n'
bundle += (cat 'src/strapdown.js') + '\n'
bundle.to outDir + '/strapdown.js'

# CSS
cp '-f', 'src/strapdown.css', outDir
mkdir '-p', outDir + '/themes'
cp '-f', 'vendor/themes/*', outDir + '/themes'

# Update ver in index.html
content = cat 'index.html'
content.replace /\/v\/\d+\.\d+\//g, '/v/' + ver + '/'

console.log "Bundles generated in #{outDir}/"
