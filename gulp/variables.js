'use strict';

var gulp = require('gulp');
var insert = require('gulp-insert');

gulp.task('inject-dist-server', function(){
  return gulp.src('src/app/app.js')
    .pipe(insert.transform(function(contents) {
      return contents.replace('http://127.0.0.1:8000', 'https://jogaadmin.herokuapp.com');
    }))
    .pipe(gulp.dest('src/app/'));
});

gulp.task('inject-server', function(){
  return gulp.src('src/app/app.js')
    .pipe(insert.transform(function(contents) {
      return contents.replace('https://jogaadmin.herokuapp.com', 'http://127.0.0.1:8000');
    }))
    .pipe(gulp.dest('src/app/'));
});
