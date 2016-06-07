const browserify = require('browserify');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const StringStream = require('string-to-stream');
const source = require('vinyl-source-stream');
const webpack = require('webpack-stream');

gulp.task('default', ['website', 'standalone']);

gulp.task('website', ['html', 'webpack']);

gulp.task('standalone', ['browserify', 'uglify']);

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('html', ['babel'], () => {
  return gulp.src('../pug-en/src/**/*.md')
    .pipe(require('./lib/markdown').renderMd('en'))
    .pipe(gulp.dest('out/en'));
});

gulp.task('demo', ['html'], () => {
  return require('./lib/markdown').getDemoFiles()
    .pipe(gulp.dest('out/en'));
});

gulp.task('uglify-js', ['babel'], () => {
  return new StringStream(require('./lib/utils/get-uglify-js').default())
    .pipe(source('uglify.js'))
    .pipe(gulp.dest('lib'));
});

gulp.task('browserify', () => {
  return browserify('../pug/lib/index.js', {
    standalone: 'pug'
  }).bundle()
    .pipe(source('pug.js'))
    .pipe(gulp.dest('out'));
});

gulp.task('uglify', ['browserify'], () => {
  return gulp.src('out/pug.js')
    .pipe(uglify())
    .pipe(rename('pug.min.js'))
    .pipe(gulp.dest('out'));
});

gulp.task('webpack', ['uglify-js'], () => {
  return gulp.src('src/entry/docs.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('out'));
});
