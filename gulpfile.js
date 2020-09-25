var gulp         = require( 'gulp' );
var plumber      = require('gulp-plumber');//強制停止防止
var sass         = require( 'gulp-sass' );
var sourcemaps   = require('gulp-sourcemaps');
var imagemin     = require('gulp-imagemin');
var notify       = require("gulp-notify");
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var postcss      = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var babel = require('gulp-babel');

var src = {
    src:'./',
    scss:'./src/scss/*.scss',
    wscss:'./src/scss/**/*.scss',
    images:'./src/images/**/*.+(jpg|jpeg|png|gif|svg)',
    js:'./src/js/*.js',
    jslib:'./src/js/lib/*.js'
}

var dist = {
    dist:'./dist/',
    images:'./dist/assets/images/',
    js:'./dist/assets/js/',
    css:'./dist/assets/css/'
}

// Sass
function scss(){
    return gulp.src(src.scss)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({
      browserlist:["defaults", "last 2 versions", "ie >= 11"]
    })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css));
}


// imagemin
function image_min() {
   return gulp.src(src.images)
   .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
   .pipe(imagemin())
   .pipe(gulp.dest(dist.images));
}

// concat js file(s)
function js_concat(){
    return gulp.src([src.jslib, src.js])
    .pipe( plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'default' ) )
    .pipe(babel({
		presets: ['@babel/preset-env']
	}))
    .pipe( concat( 'bundle.js' ) )
    .pipe( gulp.dest(dist.js) );
}

// compress js file(s)
function js_compress() {
    return gulp.src(dist.js+'bundle.js')
        .pipe( plumber() )
        .pipe( uglify() )
        .pipe( rename( 'bundle.min.js' ) )
        .pipe( gulp.dest(dist.js) );
}


function watch(){
    gulp.watch(src.wscss,scss);
    gulp.watch(src.js,gulp.series(js_concat,js_compress));
    gulp.watch(src.images,image_min);
}


exports.sass = scss;
exports.js_concat = js_concat;
exports.js_compress = js_compress;
exports.imagemin = image_min;
exports.watch = watch;
exports.build = gulp.series(sass,js_concat,js_compress,image_min);
exports.default = gulp.series(watch);
