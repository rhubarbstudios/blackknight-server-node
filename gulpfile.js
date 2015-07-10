'use strict';

var gulp = require('gulp');
var env = require('gulp-env');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var lab = require('gulp-lab');
var betterConsole = require('better-console');
var open = require('gulp-open');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var path = require('path');
var server = require('gulp-develop-server');
var del = require('del');

var paths = {
    es6: ['es6/**/*.js'],
    es5: 'es5',
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, 'es6'),
};

gulp.task('clean', function(done) {
  del([paths.es5 + '/**/*'], done);
});

gulp.task('babel', ['clean'], function() {
  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    // .pipe(plumber())
    .pipe(babel())
    .pipe(sourcemaps.write('.', {
      sourceRoot: paths.sourceRoot
    }))
    .pipe(gulp.dest(paths.es5));
});

// gulp.task('lint', function() {
//   return gulp.src([
//       '**/*.js',
//       '!test/**/*.js',
//       '!./{node_modules,node_modules/**}'
//     ])
//       .pipe(jshint())
//       .pipe(jshint.reporter('jshint-stylish'));
// });
//
// gulp.task('jscs', ['lint'], function() {
//   return gulp.src([
//       '**/*.js',
//       '!test/**/*.js',
//       '!./{node_modules,node_modules/**}'
//     ])
//       .pipe(plumber())
//       .pipe(jscs())
//       .pipe(plumber.stop());
// });

// gulp.task('test', ['set-test-env', 'set-node-path'], function() {
//   return gulp.src([
//       'test/**/*.js',
//       '!./{node_modules,node_modules/**}'
//     ], { read: false })
//       .pipe(lab({
//         args: '-c -t 85',
//         opts: {
//           emitLabError: true
//         }
//       }));
// });
//
// gulp.task('set-dev-env', function() {
//   return env({
//       vars: {
//
//       }
//     });
// });

// gulp.task('set-test-env', function() {
//   return env({
//       vars: {
//         NODE_ENV: 'test'
//       }
//     });
// });

// gulp.task('test-local', ['test']);

// gulp.task('set-node-path', function() {
//   return env({
//       vars: {
//         NODE_PATH: '.'
//       }
//     });
// });

gulp.task('clear-buffer', function() {
  betterConsole.clear();
});

gulp.task('serve', ['babel'], function() {

  // gulp.watch(paths.es6, ['babel']);

  server.listen({
    path: paths.es5 + '/server.js',
    env: {
      NODE_PATH: '.',
      NODE_ENV: 'development',
      BLACKKNIGHTSERVER_HOST: '0.0.0.0',
      BLACKKNIGHTSERVER_PORT: 9000
    }
  }, function(err) {
    if (err) {
      console.log('error!: ', err);
    }
  });
  gulp.watch(paths.es6, ['server:restart']);
});

gulp.task('server:restart', ['babel'], function() {
  server.restart();
});

// gulp.task('watch', ['watch-lint-jscs-test']);
// gulp.task('watch-lint-jscs-test', [
//   'set-test-env',
//   'set-node-path',
//   'clear-buffer',
//   'lint',
//   'jscs',
//   'test'
// ], function() {
//
//   gulp.watch([
//     './**/*.js',
//     '!./{node_modules,node_modules/**}'
//     ], ['clear-buffer', 'lint', 'jscs', 'test']);
//
// });
//
// gulp.task('test-report', ['clear-buffer', 'set-test-env', 'set-node-path'], function() {
//   gulp.src([
//     'test/**/*.js',
//     '!./{node_modules,node_modules/**}'
//   ], { read: false })
//     .pipe(lab('-r html -o coverage.html'));
//
//   gulp.src('./coverage.html')
//     .pipe(open('./coverage.html'));
//
//   return console.log('Test coverage report generated: coverage.html');
// });
