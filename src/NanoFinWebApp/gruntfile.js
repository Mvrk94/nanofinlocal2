/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'scripts/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_targets: {
                files: {
                    'wwwroot/app.js': ['scripts/app.js', 'scripts/**/*.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['scripts/**/*.js', 'Gruntfile.js'],
                tasks: ['uglify', 'jshint']
            }
        }
    });

    grunt.registerTask('build', ['uglify', 'watch']);
    grunt.registerTask('CodeQuality', ['watch', 'jshint']);
};
