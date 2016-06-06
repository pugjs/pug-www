const browserify = require('browserify');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const source = require('vinyl-source-stream');

gulp.task('default', ['babel', 'html', 'pug.js', 'pug.min.js']);

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('html', ['babel'], function () {
  return gulp.src('../pug-en/src/**/*.md')
    .pipe(require('./lib/markdown').default('en'))
    .pipe(gulp.dest('out/en'));
});

gulp.task('ext', ['babel'], function () {
  return gulp.src('../pug-en/src/reference/extends.md')
    .pipe(require('./lib/markdown').default('en'))
    .pipe(gulp.dest('out/en'));
});

gulp.task('pug.js', function () {
  return browserify('../pug/lib/index.js', {
    standalone: 'pug'
  }).bundle()
    .pipe(source('pug.js'))
    .pipe(gulp.dest('out'));
});

gulp.task('pug.min.js', ['pug.js'], function () {
  return gulp.src('out/pug.js')
    .pipe(uglify())
    .pipe(rename('pug.min.js'))
    .pipe(gulp.dest('out'));
});
