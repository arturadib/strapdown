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
		grunt.loadNpmTasks('grunt-preprocess');

		var pkg = grunt.file.readJSON('package.json');
		// Computes a version number with only 2 digits (e.g. '0.4' instead of '0.4.0')
		pkg.shortVers = pkg.version.split('.').splice(0, 2).join('.');

		grunt.initConfig({
			pkg: pkg,

			preprocess: {
				dev: {
					files: {
						'tmp/strapdown.js': 'src/strapdown.js',
						'tmp/strapdown-toc.js': 'src/strapdown-toc.js',
						'tmp/strapdown-bootstrap.js': 'src/strapdown-bootstrap.js',
					},
					options: {
						context: {
							DEBUG: true
						}
					}
				},
				release: {
					files: {
						'tmp/strapdown.js': 'src/strapdown.js',
						'tmp/strapdown-toc.js': 'src/strapdown-toc.js',
						'tmp/strapdown-bootstrap.js': 'src/strapdown-bootstrap.js',
					},
					options: {
						context: {
							DEBUG: false
						}
					}
				}
			},

			concat: {
				options: {
					separator: ';\n'
				},
				dist: {
					src: [
						'vendor/jquery/dist/jquery.min.js',
						// 'vendor/jquery/dist/jquery.js',
						'vendor/marked/marked.min.js',
						'vendor/google-code-prettify/bin/prettify.min.js',
						'vendor/bootstrap/js/scrollspy.js',
						// 'vendor/bootstrap/js/collapse.js',
						'tmp/strapdown.js',
						'tmp/strapdown-toc.js',
						'tmp/strapdown-bootstrap.js'
					],
					dest: 'v/<%= pkg.shortVers %>/strapdown.js'
				}
			},

			uglify: { // in-place minify. This is to make the loading from the html easier, since the filename is the same.
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				dist: {
					files: {
						'<%= concat.dist.dest %>': ['<%= concat.dist.dest %>']
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
					tasks: ['preprocess:dev', 'jshint', 'concat','qunit']
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
						'v/<%= pkg.shortVers %>/strapdown.css': 'src/strapdown.less'
					}
				}
			},

			// Used for in-place update of the html files.
			replace: {
				html: {
					src: ['*.html'],
					overwrite: true,
					replacements: [{
						from: /(<!--\s*grunt:update-version-start\s*-->\s*)((?:.|\s)*?)(\s*<!--\s*grunt:update-version-end\s*-->)/,
						to: '$1<script src="v/<%= pkg.shortVers %>/strapdown.js"></script>$3'
					}]
				},
				test: {
					src: ['test/*.html'],
					overwrite: true,
					replacements: [{
						from: /(<!--\s*grunt:update-version-start\s*-->\s*)((?:.|\s)*?)(\s*<!--\s*grunt:update-version-end\s*-->)/,
						to: '$1<script src="../v/<%= pkg.shortVers %>/strapdown.js"></script>$3'
					}]
				}
			},

			clean: [
				'v/<%= pkg.shortVers %>/'
			],
		});

		// Renamed to allow running clean and a first build before doing the deltas
		grunt.renameTask( 'watch', 'delta' );

		grunt.registerTask('test',           ['jshint', 'qunit']);
		grunt.registerTask('build',          ['jshint','concat', 'less']);
		grunt.registerTask('default',        ['clean', 'preprocess:release', 'build', 'uglify', 'qunit']);
		grunt.registerTask('watch',          ['clean', 'preprocess:dev', 'build', 'qunit', 'delta']);
		grunt.registerTask('update-version', ['replace']);

	};
})();