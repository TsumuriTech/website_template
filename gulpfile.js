var gulp         = require( 'gulp' );
var sass         = require( 'gulp-sass' );
var autoprefixer = require( 'autoprefixer' );
var plumber      = require( 'gulp-plumber' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var progeny      = require( 'gulp-progeny' );
var changed      = require( 'gulp-changed' );
var imagemin     = require( 'gulp-imagemin' );
var imageminJpg  = require( 'imagemin-jpeg-recompress' );
var imageminPng  = require( 'imagemin-pngquant' );
var imageminGif  = require( 'imagemin-gifsicle' );
var svgmin       = require( 'gulp-svgmin' );
var concat       = require( 'gulp-concat' );
var jshint       = require( 'gulp-jshint' );
var rename       = require( 'gulp-rename' );
var uglify       = require( 'gulp-uglify' );
var browserSync  = require( 'browser-sync' );
var postcss = require('gulp-postcss');
var notify = require('gulp-notify');

var src = {
    src:'./',
    scss:'./src/scss/*.scss',
    images:'./src/assets/images/**/*.+(jpg|jpeg|png|gif)',
    svgs:'./src/assets/images/**/*.+(svg)',
    js:'./src/js/*.js',
}

var dist = {
    dist:'./dist/',
    images:'./dist/images/',
    bundlejs:'./dist/bundle.js'
}

// Sass
function scss(){
    return gulp.src(src.scss)
        .pipe( plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
        .pipe( progeny() )
        .pipe( sourcemaps.init() )
        .pipe( sass( {
            outputStyle: 'expanded'
        } ) )
        .pipe( postcss(
                [autoprefixer( {
                    "overrideBrowserlist": ['last 2 version', 'ie >= 11', 'Android >= 4.4'],
                    cascade: false
                } )]
            )
        )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest(dist.dist));
}

// imagemin
function imagemin() {
    // jpeg,png,gif
   return gulp.src(src.images)
       .pipe( changed(dist.images) )
       .pipe( imagemin( [
           imageminPng(),
           imageminJpg(),
           imageminGif({
               interlaced: false,
               optimizationLevel: 3,
               colors: 180
           } )
       ] ) )
       .pipe( gulp.dest(dist.images));
}

function svgmin(){
    // svg
    return gulp.src(src.svgs)
        .pipe( changed(dist.images) )
        .pipe( svgmin() )
        .pipe( gulp.dest(dist.images) );
}

// concat js file(s)
function js_concat(){
    return gulp.src( [
        src.js
    ] )
        .pipe( plumber() )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( concat( 'bundle.js' ) )
        .pipe( gulp.dest(dist.dist) );
}

// compress js file(s)
function js_compress() {
    gulp.src(dist.bundlejs)
        .pipe( plumber() )
        .pipe( uglify() )
        .pipe( rename( 'bundle.min.js' ) )
        .pipe( gulp.dest(dist.dist) );
}

// Browser Sync
function bs(done) {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
    done();
}

// Reload Browser
function bs_reload(done) {
    browserSync.reload();
    done();
}

function watch(){
    gulp.watch(src.src+'*.html',bs_reload);
    gulp.watch(src.scss,scss);
    gulp.watch(src.scss,bs_reload);
    gulp.watch(src.js,js_concat);
    gulp.watch(src.js,js_compress);
    gulp.watch(src.js,bs_reload);
    gulp.watch(src.images,imagemin);
    gulp.watch(src.images,bs_reload);
    gulp.watch(src.svgs,svgmin);
    gulp.watch(src.svgs,bs_reload);
}


exports.bs_reload = bs_reload;
exports.scss = scss;
exports.js_concat = js_concat;
exports.js_compress = js_compress;
exports.imagemin = imagemin;
exports.svgmin = svgmin;
exports.watch = watch;
exports.bs = bs;
exports.default = gulp.series(
    gulp.parallel(bs,watch)
);
