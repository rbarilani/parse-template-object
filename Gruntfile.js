'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/*.js']
    },
    jshint: {
      gruntfile_tasks: ['Gruntfile.js'],
      libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      gruntfile_tasks: {
        files: ['<%= jshint.gruntfile_tasks %>'],
        tasks: ['jshint:gruntfile_tasks']
      },
      libs_n_tests: {
        files: ['<%= jshint.libs_n_tests %>'],
        tasks: ['jshint:libs_n_tests', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // "npm test" runs these tasks
  grunt.registerTask('test', '', function(reporter) {
    grunt.task.run(['jshint', 'nodeunit:' + (reporter || 'all')]);
  });

  // Default task.
  grunt.registerTask('default', ['test']);

};
