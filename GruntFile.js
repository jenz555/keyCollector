module.exports = function(grunt) {

    grunt.initConfig({

        // SASS
        sass: {
          options: {},
          dist: {
            files: {
              'assets/styles/app.css': 'assets/styles/app.scss'
            }
          }
        },

        // MINIFY CSS
        cssmin: {
          dist: {
            src: ['assets/styles/app.css'],
            dest: 'assets/styles/app.min.css'
          }
        },

        // JS MINIFICATION
        uglify: {
          options: {
            mangle: false,
            compress: false,
            preserveComments: false
          },
          dist: {
            files: {
              'assets/scripts/app.min.js': [
                'assets/scripts/libs/aic-1.6.0.min.js',
                'assets/scripts/_global.js',
                'assets/scripts/utilities.js'
              ]
            }
          }
        },

        // WATCH
        watch: {
          sass: {
            files: ['assets/styles/**/*.scss'],
            tasks: ['sass','cssmin']
          },
          js: {
            files: ['assets/scripts/**/*.js'],
            tasks: ['uglify']
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', [
      'sass',
      'cssmin',
      'uglify',
      'watch'
    ]);

};
