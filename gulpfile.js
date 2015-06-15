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

gulp.task('lint', function() {
  return gulp.src([
      '**/*.js',
      '!test/**/*.js',
      '!./{node_modules,node_modules/**}'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', ['lint'], function() {
  return gulp.src([
      '**/*.js',
      '!test/**/*.js',
      '!./{node_modules,node_modules/**}'
    ])
      .pipe(plumber())
      .pipe(jscs())
      .pipe(plumber.stop());
});

gulp.task('test', ['set-test-env', 'set-node-path'], function() {
  return gulp.src([
      'test/**/*.js',
      '!./{node_modules,node_modules/**}'
    ], { read: false })
      .pipe(lab({
        args: '-c -t 85',
        opts: {
          emitLabError: true
        }
      }));
});

gulp.task('set-test-env', function() {
  return env({
      vars: {
        NODE_ENV: 'test'
      }
    });
});

gulp.task('test-local', ['set-local-env', 'test']);
gulp.task('serve-local', ['set-local-env', 'set-dev-env', 'serve']);

gulp.task('set-node-path', function() {
  return env({
      vars: {
        NODE_PATH: '.'
      }
    });
});

gulp.task('clear-buffer', function() {
  betterConsole.clear();
});

gulp.task('serve', function() {
  env({
    vars: {
      NODE_PATH: '.',
      BLACKKNIGHTSERVER_HOST: '0.0.0.0',
      BLACKKNIGHTSERVER_PORT: 9000
    }
  });

  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});

gulp.task('watch', ['watch-lint-jscs-test']);
gulp.task('watch-lint-jscs-test', [
  'set-test-env',
  'set-node-path',
  'clear-buffer',
  'lint',
  'jscs',
  'test'
], function() {

  gulp.watch([
    './**/*.js',
    '!./{node_modules,node_modules/**}'
    ], ['clear-buffer', 'lint', 'jscs', 'test']);

});

gulp.task('test-report', ['clear-buffer', 'set-test-env', 'set-node-path'], function() {
  gulp.src([
    'test/**/*.js',
    '!./{node_modules,node_modules/**}'
  ], { read: false })
    .pipe(lab('-r html -o coverage.html'));

  gulp.src('./coverage.html')
    .pipe(open('./coverage.html'));

  return console.log('Test coverage report generated: coverage.html');
});
