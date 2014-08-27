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
					src: ['<%= pkg.deps %>'],
					dest: 'demos/vendor/',
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
					dest: 'v/<%= pkg.shortVers %>/strapdown.js'
				},
				plugin: {
					src: [
						'tmp/strapdown.js',
						'tmp/strapdown-toc.js'
					],
					dest: 'v/<%= pkg.shortVers %>/jquery.strapdown.js'
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
						'v/<%= pkg.shortVers %>/jquery.strapdown.min.js': ['<%= concat.plugin.dest %>']
					}
				}
			},

			qunit: {
				files: ['test/**/*.html']
			},

			jshint: {
				files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
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
						'v/<%= pkg.shortVers %>/jquery.strapdown.min.css': 'src/less/strapdown.less',
						'v/<%= pkg.shortVers %>/strapdown.css': 'src/less/strapdown-bi.less'
					}
				}
			},

			// Used for in-place update of the html files.
			replace: {
				index: {
					src: ['index.html'],
					overwrite: true,
					replacements: [{
						from: /(<!--\s*grunt:update-version-start\s*-->\s*)((?:.|\s)*?)(\s*<!--\s*grunt:update-version-end\s*-->)/,
						to: '$1<script src="v/<%= pkg.shortVers %>/strapdown.js"></script>$3'
					}]
				},
				demos: {
					src: ['demos/*.html'],
					overwrite: true,
					replacements: [{
						from: /(<!--\s*grunt:update-version-start\s*-->\s*)((?:.|\s)*?)(\s*<!--\s*grunt:update-version-end\s*-->)/,
						to: '$1<script src="../v/<%= pkg.shortVers %>/strapdown.js"></script>$3'
					}]
				}
			},

			clean: {
				files: {
					src: [
						'v/<%= pkg.shortVers %>/',
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
		grunt.registerTask('default',        ['clean', 'test', 'copy:pluginDeps', 'preprocess:release', 'build', 'uglify']);
		grunt.registerTask('watch',          ['clean', 'test', 'copy:pluginDeps', 'preprocess:dev', 'build', 'delta']);
		grunt.registerTask('update-version', ['replace']);

	};
})();