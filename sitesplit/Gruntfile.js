module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: [
          /* {
            expand: true,
            cwd: 'etc/designs/bwpublic/less/1_global/',
            src: ['*.less'],
            dest: 'etc/designs/bwpublic/css/1_global/',
            rename: function(dest, src) {
              return dest + src.replace(/\.less$/, ".css");
            }
          },*/
          {
            "etc/designs/bwpublic/css/clientlib2.0.css":"etc/designs/bwpublic/less/**/*.less"
          }
        ]
      }
    },
    watch: {
      styles: {
        files: ['etc/designs/bwpublic/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};