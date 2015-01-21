'use strict';

var gulp = require('gulp');
var insert = require('gulp-insert');
var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'src' || (util.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
    routes = {
      // Should be '/bower_components': '../bower_components'
      // Waiting for https://github.com/shakyShane/browser-sync/issues/308
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });

}

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

gulp.task('serve', ['inject-server', 'watch'], function () {
  browserSyncInit([
    'src',
    '.tmp'
  ], [
    '.tmp/{app,components}/**/*.css',
    'src/images/**/*',
    'src/*.html',
    'src/{app,components}/**/*.html',
    'src/{app,components}/**/*.js'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', function () {
  browserSyncInit(['src', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
  browserSyncInit('dist', null, []);
});
