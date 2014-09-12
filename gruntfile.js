(function() {
	'use strict';

	module.exports = function(grunt) {

		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-qunit');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-text-replace');
		grunt.loadNpmTasks('grunt-contrib-less');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-preprocess');

		var pkg = grunt.file.readJSON('package.json');
		// Computes a version number with only 2 digits (e.g. '0.4' instead of '0.4.0')
		pkg.shortVers = pkg.version.split('.').splice(0, 2).join('.');
		pkg.deps = [
			// 'vendor/jquery/dist/jquery.js',
			'vendor/jquery/dist/jquery.min.js',
			'vendor/marked/marked.min.js',
			'vendor/google-code-prettify/bin/prettify.min.js',
			'vendor/bootstrap/js/scrollspy.js'
		];

		grunt.initConfig({
			pkg: pkg,

			preprocess: {
				dev: {
					files: [{
						expand: true,
						cwd: 'src/js',
						src: ['*.js'],
						dest: 'tmp/'
					}],
					options: {
						context: {
							DEBUG: true
						}
					}
				},
				release: {
					files: '<%= preprocess.dev.files %>',
					options: {
						context: {}
					}
				}
			},

			copy: {
				pluginDeps: {
					expand: true,   // enable dynamic options
					flatten: true,  // to avoid the creation of subdirectories
					src: [
						'<%= pkg.deps %>',
						'vendor/bootstrap/dist/css/bootstrap.min.css'
					],
					dest: 'demos/vendor/',
				},
				testDeps: {
					expand: true,   // enable dynamic options
					flatten: true,  // to avoid the creation of subdirectories
					src: [
						'vendor/qunit/qunit/qunit.js',
						'vendor/qunit/qunit/qunit.css'
					],
					dest: 'test/vendor/',
				}
			},

			concat: {
				options: {
					separator: ';\n'
				},
				standalone: {
					src: [
						'<%= pkg.deps %>',
						'tmp/strapdown.js',
						'tmp/strapdown-toc.js',
						'tmp/strapdown-bi.js'
					],
					dest: 'dist/strapdown.js'
				},
				plugin: {
					src: [
						'tmp/strapdown.js',
						'tmp/strapdown-toc.js'
					],
					dest: 'dist/jquery.strapdown.js'
				}
			},

			uglify: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				dist: {
					files: {
						// in-place minify. This is to make the loading from the html easier, since the filename is the same.
						'<%= concat.standalone.dest %>': ['<%= concat.standalone.dest %>'],
						'dist/jquery.strapdown.min.js': ['<%= concat.plugin.dest %>']
					}
				}
			},

			qunit: {
				files: ['test/**/*.html']
			},

			jshint: {
				files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!**/vendor/**/*.js'],
				options: {
					globals: {
						console: true,
					}
				}
			},

			delta: {
				js: {
					files: ['<%= jshint.files %>'],
					tasks: ['test', 'preprocess:dev', 'concat']
				},
				less: {
					files: ['src/**/*.less'],
					tasks: ['less']
				}
			},

			less: {
				dist: {
					options: {
						cleancss: true
					},
					files: {
						'dist/jquery.strapdown.min.css': 'src/less/strapdown.less',
						'dist/strapdown.css': 'src/less/strapdown-bi.less'
					}
				}
			},

			clean: {
				files: {
					src: [
						'dist/',
						'demos/vendor/',
						'tmp/'
					]
				}
			}
		});

		// Renamed to allow running clean and a first build before doing the deltas
		grunt.renameTask( 'watch', 'delta' );

		grunt.registerTask('test',           ['jshint', 'qunit']);
		grunt.registerTask('build',          ['concat', 'less']);
		grunt.registerTask('default',        ['clean', 'copy', 'test', 'preprocess:release', 'build', 'uglify']);
		grunt.registerTask('watch',          ['clean', 'copy', 'test', 'preprocess:dev', 'build', 'delta']);

	};
})();