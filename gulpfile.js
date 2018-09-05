'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    wait = require('gulp-wait'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    flatten = require('gulp-flatten'),
    gulpPug = require('gulp-pug'),
    webserver = require('gulp-webserver');

var path = {
    build: { // куда складывать
        html: 'build/',
        js: 'build/js/',
        images: 'build/images/',
        css: 'build/css/',
        fonts: 'build/fonts/'
    },
    src: { // откуда брать
        html: 'assets/index.pug',
        js: 'assets/js/script.js',
        style: 'assets/scss/main.scss',
        fonts: 'assets/fonts/*.*'
    },
    watch: { // за чем наблюдать
        js: 'assets/js/script.js',
        style: 'assets/scss/*.scss'
    },
    clean: './assets'
};




function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

gulp.task('webserver', function() {
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      //directoryListing: true,
      open: true
    }));
});


// Собрать Pug в html

gulp.task('html:build', function () {

    return gulp.src(path.src.html)
    .pipe(gulpPug({
        pretty: true
    }))
    .on('error', log)
    .pipe(flatten())
    .pipe(gulp.dest(path.build.html))
});


// шрифты

gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});


/* собрать скрипты */
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest(path.build.js))
});

/* собрать scss в css */
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(wait(200))
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(path.build.css))
});


/* сжать картинки */
gulp.task('images:build', function () {
    gulp.src(['assets/images/*.*', 'assets/images/**/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
});

/* собрать всё */
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'images:build',
    'webserver',
    'fonts'
]);


/* следить за изменениями */
gulp.task('watch', function(){
    watch(['assets/index.pug', 'assets/components/*.pug'], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch(['assets/images/*.*', 'assets/images/**/*.*'], function(event, cb) {
        gulp.start('images:build');
    });
});

gulp.task('default', ['build', 'watch']);
