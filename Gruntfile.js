//Grunt File
module.exports = function(grunt) {
    grunt.initConfig({
        browserSync: {
            dev: {
                options: {
                    //server: "./app",
    			//this might work
			proxy: "localhost:3000",
                    background: true
                }
            }
        },
        watch: {
            html: {
                files: ['app/index.html'],
                tasks: ['bsReload:all'],
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'bsReload:js']
            },
            test: {
                files: ['test/**/*.tests.js'],
                tasks: ['karma']
            },
            options: {
                spawn: false
            }
        },
        bsReload: {
            all: {
                reload: true
            },
            js: {
                reload: 'app/built-script.js'
            }
        },
        browserify: {
            client: {
                src: 'src/main.js',
                dest: 'app/built-script.js',
                options: {
                    transform: ['babelify']
                }
            }
        },
        eslint: {
            target: ['src/**/*.js'],
            options: {
                fix: true,
                config: 'eslint.conf.json'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['browserify', 'browserSync', 'watch']);
    grunt.registerTask('build', ['browserify']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('lint', ['eslint']);
}
