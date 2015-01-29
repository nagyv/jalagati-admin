'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {
  return gulp.src(['src/less/app.less'])
    .pipe($.less({
      paths: [
        'src/bower_components',
        'src/less'
      ]
    }))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/app/'));
});

gulp.task('injector:css:preprocessor', function () {
  return gulp.src('src/less/app.less')
    .pipe($.inject(gulp.src([
        'src/{less}/**/*.less',
        '!src/less/app.less'
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace('src/less/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/app/'));
});

gulp.task('injector:css', ['styles'], function () {
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src([
        '.tmp/{app,components}/**/*.css'
      ], {read: false}), {
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('jshint', function () {
  return gulp.src('src/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('injector:js', ['jshint'], function () {
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src([
        'src/{app,components}/**/*.js',
        '!src/{app,components}/**/*.spec.js',
        '!src/{app,components}/**/*.mock.js'
      ], {read: false}), {
      ignorePath: 'src',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('partials', function () {
  return gulp.src('src/{app,components}/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'jalagatiJoga'
    }))
    .pipe(gulp.dest('.tmp/inject/'));
});

gulp.task('html', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/*.html')
    .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
//    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({
      compress: false,
      mangle: false,
//      sequences     : false,  // join consecutive statemets with the “comma operator”
//      properties    : false,  // optimize property access: a["foo"] → a.foo
//      dead_code     : false,  // discard unreachable code
//      drop_debugger : false,  // discard “debugger” statements
//      unsafe        : false, // some unsafe optimizations (see below)
//      conditionals  : false,  // optimize if-s and conditional expressions
//      comparisons   : false,  // optimize comparisons
//      evaluate      : false,  // evaluate constant expressions
//      booleans      : false,  // optimize boolean expressions
//      loops         : false,  // optimize loops
//      unused        : false,  // drop unused variables/functions
//      hoist_funs    : false,  // hoist function declarations
//      hoist_vars    : false, // hoist variable declarations
//      if_return     : false,  // optimize if-s followed by return/continue
//      join_vars     : false,  // join var declarations
//      cascade       : false,  // try to cascade `right` into `left` in sequences
//      side_effects  : false,  // drop side-effect-free statements
//      warnings      : false,  // warn about potentially dangerous optimizations/code
      preserveComments: true
    }))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
//    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist/'))
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
  $.del(['dist/*', '.tmp/', '!dist/.git/', '!dist/CNAME'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);

gulp.task('release', ['inject-dist-server', 'clean', 'build']);
