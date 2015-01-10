'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {
  gulp.watch('src/less/**/*.less', ['injector:css']);
  gulp.watch('src/{app,components}/**/*.js', ['injector:js']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
