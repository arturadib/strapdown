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

		var pkg = grunt.file.readJSON('package.json');
		// Computes a version number with only 2 digits (e.g. '0.4' instead of '0.4.0')
		pkg.shortVers = pkg.version.split('.').splice(0, 2).join('.');

		grunt.initConfig({
			pkg: pkg,

			concat: {
				options: {
					separator: ';\n'
				},
				dist: {
					src: [
						'vendor/jquery/dist/jquery.min.js',
						'vendor/marked/marked.min.js',
						'vendor/google-code-prettify/bin/prettify.min.js',
						'vendor/bootstrap/js/scrollspy.js',
						// 'vendor/bootstrap/js/collapse.js',
						'src/strapdown.js',
						'src/strapdown-toc.js',
						'src/strapdown-bootstrap.js'
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
					tasks: ['jshint', 'concat','qunit']
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

			replace: {
				html: {
					src: ['*.html'],
					overwrite: true,
					replacements: [{
						// Need to capture the start and end tokens to put them back in
						from: /(<!--\s*grunt:update-version-start\s*-->\s*)((?:.|\s)*?)(\s*<!--\s*grunt:update-version-end\s*-->)/,
						to: '$1<script src="v/<%= pkg.shortVers %>/strapdown.js"></script>$3'
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
		grunt.registerTask('build',          ['jshint', 'concat', 'less']);
		grunt.registerTask('default',        ['clean', 'build', 'uglify', 'qunit']);
		grunt.registerTask('watch',          ['clean', 'build', 'qunit', 'delta']);
		grunt.registerTask('update-version', ['replace:html']);

	};
})();