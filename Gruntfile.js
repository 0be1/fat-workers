'use strict';

module.exports = function(grunt) {
    var modules = 'node_modules/',
        dist = 'dist';
    
    grunt.initConfig({
        less: {
            site: {
              files: {
                'site/main.css': 'styles/main.less',
              }
            },
        },
        
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            workers: {
                files: {
                    'site/giac_worker.js': 'scripts/giac_worker.js',
                }
            },
            dist: {
                options: {
                    "plugins": ["transform-es2015-modules-amd"],
                },
                files: {
                    'site/main.js': 'scripts/main.js',
                }
            },
        },
        
        copy: {
            site: {
                files: [
                    {src: ['index.html'], dest: 'site/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['styles/theme.css'], dest: 'site/', filter: 'isFile'},
                    {expand: true, flatten: true, cwd: dist, src: ['giac.js', 'domReady/domReady.js', 'pubcss/formats/acm-sig/css/pub.css'], dest: 'site/', filter: 'isFile'},
                    {expand: true, flatten: true, cwd: modules, src: ['normalize.css/normalize.css', 'requirejs/require.js', 'promise-worker/register.js', 'promise-worker/dist/*.min.js'], dest: 'site/', filter: 'isFile'},
                ],
              },
        },
        
        clean: {
			site: ['site/*' ],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.loadNpmTasks('grunt-contrib-less');
    
    grunt.loadNpmTasks('grunt-babel');
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('default', ['less', 'babel', 'copy']);
};
