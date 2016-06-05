const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const util = require('gulp-util');
const through = require('through2');

gulp.task('default', ['js', 'html']);

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('js-watch', function () {
  return gulp.src('src/**/*.js')
    .pipe(watch('src/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('html', ['js'], function () {
  return gulp.src('../pug-en/src/**/*.md')
    .pipe(renderMd())
    .pipe(gulp.dest('out'));
});

function renderMd() {
  const md = require('./lib/markdown').default;

  return through.obj(function (file, encoding, callback) {
    if (file.isNull() || file.content === null) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new util.PluginError('md', 'Streams not supported!'));
    }

    try {
      let rendered = md.render(file.contents.toString());
      file.contents = Buffer.from ? Buffer.from(rendered) : new Buffer(rendered);
      file.path = util.replaceExtension(file.path, '.html');

      this.push(file);
    } catch (err) {
      return callback(new util.PluginError('md', err, {
        fileName: file.path,
        showStack: true
      }));
    }

    callback();
  });
}
