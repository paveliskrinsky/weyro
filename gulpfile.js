const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    // .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fileinclude', function () {
  return gulp.src('src/html-layouts/*.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
  return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('src/html-layouts/**/*.html', gulp.parallel('fileinclude'));
  gulp.watch('app/js/*.js', gulp.parallel('js'));
});

gulp.task('default', gulp.parallel('fileinclude', 'sass', 'watch', 'browser-sync'));