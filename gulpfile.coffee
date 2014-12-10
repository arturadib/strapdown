gulp = require 'gulp'
replace = require 'gulp-replace'
concat = require 'gulp-concat'
gutil = require 'gulp-util'
bump = require 'gulp-bump'

ver = gutil.env.build

if not ver
  console.log 'strapdown:', gutil.colors.red 'You need to specify the version'
  console.log 'gulp <tasks> --build <version>'
  console.log 'gulp --build 0.5'
  process.exit()

paths =
  build: "v/#{ver}"
  js: [
    'vendor/marked.min.js',
    'vendor/prettify.min.js',
    'src/*.js'
  ]
  css: 'src/*.css'
  themes: 'vendor/themes/*'
  html: 'index.html'
  pkg: 'package.json'


gulp.task 'css', ->
  gulp.src paths.css
  .pipe gulp.dest paths.build


gulp.task 'js', ->
  gulp.src paths.js
  .pipe concat 'strapdown.js'
  .pipe gulp.dest paths.build


gulp.task 'themes', ->
  gulp.src paths.themes
  .pipe gulp.dest "#{paths.build}/themes"


gulp.task 'html', ->
  gulp.src paths.html
  .pipe replace /\/v\/\d+\.\d+\//g, "/v/#{ver}/"
  .pipe gulp.dest './'


gulp.task 'bump', ->
  gulp.src paths.pkg
  .pipe bump version: ver
  .pipe gulp.dest './'


gulp.task 'default', ['css', 'js', 'themes', 'html', 'bump']
