const browserify = require('browserify');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const source = require('vinyl-source-stream');

gulp.task('default', ['website', 'standalone']);

gulp.task('website', ['html', 'demo']);

gulp.task('standalone', ['browserify', 'uglify']);

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('html', ['babel'], function () {
  return gulp.src('../pug-en/src/**/*.md')
    .pipe(require('./lib/markdown').renderMd('en'))
    .pipe(gulp.dest('out/en'));
});

gulp.task('demo', ['html'], function () {
  return require('./lib/markdown').getDemoFiles()
    .pipe(gulp.dest('out/en'));
});

gulp.task('browserify', function () {
  return browserify('../pug/lib/index.js', {
    standalone: 'pug'
  }).bundle()
    .pipe(source('pug.js'))
    .pipe(gulp.dest('out'));
});

gulp.task('uglify', ['browserify'], function () {
  return gulp.src('out/pug.js')
    .pipe(uglify())
    .pipe(rename('pug.min.js'))
    .pipe(gulp.dest('out'));
});
