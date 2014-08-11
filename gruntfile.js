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

		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),

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
						'vendor/bootstrap/js/collapse.js',
						'src/strapdown.js',
						'src/strapdown-toc.js'
					],
					dest: 'v/<%= pkg.version %>/strapdown.js'
				},
				full: {
					src: [
						'<%= concat.dist.dest %>'
					],
					dest: 'v/<%= pkg.version %>/<%= pkg.name%>.js'
				}
			},

			uglify: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				dist: {
					files: {
						// 'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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

			watch: {
				js: {
					files: ['<%= jshint.files %>'],
					tasks: ['jshint', 'qunit', 'concat:dist', 'uglify']
				},
				less: {
					files: ['<%= jshint.files %>'],
					tasks: ['less:dev']
				}
			},

			less: {
				dev: {
					options: {
						cleancss: true
					},
					files: {
						'v/<%= pkg.version %>/strapdown.css': 'src/strapdown.less'
					}
				},
				release: {
					files: {
						'v/<%= pkg.version %>/strapdown.min.css': 'src/strapdown.less'
					}
				}
			},

			replace: {
				html: {
					src: ['*.html'],
					overwrite: true,
					replacements: [{
						from: /<!--\s*grunt:update-version-start\s*-->\s*((?:.|\s)*?)\s*<!--\s*grunt:update-version-end\s*-->/,
						to: function replaceFn (matchedWord, index, fullText, matches) {
							grunt.log.write(matches);
							return '' +
								'<script src="v/<%= pkg.version %>/strapdown.js"></script>'
								;
						}
					}
					]
				}
			}
		});

		grunt.registerTask('test', ['jshint', 'qunit']);
		// grunt.registerTask('default', ['jshint', 'qunit', 'concat:dist', /*'uglify',*/ 'concat:full','less:dev']);
		grunt.registerTask('default', ['jshint', 'qunit', 'concat:dist', /*'uglify'*/, 'less:dev']);


		grunt.registerTask('w', ['default', 'watch']);
		grunt.registerTask('update-version', ['replace:html']);

	};
})();