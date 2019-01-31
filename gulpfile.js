var gulp = require("gulp"),
  plumber = require("gulp-plumber"),
  browserSync = require("browser-sync"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  newer = require("gulp-newer"),
  graphicsMagick = require("gulp-gm"),
  imagemin = require("gulp-imagemin"),
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  exec = require("child_process").exec;

/**
 * Build the Jekyll Site
 */
function jekyllBuild(done) {
  exec("bundle exec jekyll serve", function(err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
  });
  done();
}

function startBrowserSync(done) {
  browserSync.init({
    port: 3000,
    proxy: "http://localhost:4000"
  });
  done();
}

function processStyles() {
  return gulp
    .src("_site/css/main.css")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      cleanCSS({
        // compatibility: "ie8",
        level: { 1: { specialComments: false } }
      })
    )
    .pipe(concat("main.min.css"))
    .pipe(gulp.dest("assets/css"))
    .pipe(gulp.dest("_site/assets/css"));
}

function processScripts() {
  return gulp
    .src(["src/js/jquery.min.js", "src/js/jquery.scrollex.min.js", "src/js/jquery.scrolly.min.js", "src/js/skel.min.js", "src/js/util.js", "src/js/*.js"])
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("assets/js/"))
    .pipe(gulp.dest("_site/assets/js/"))
    .pipe(browserSync.stream());
}

function processImages() {
  return gulp
    .src("src/img/**/*.{jpg,png,gif}")
    .pipe(plumber())
    .pipe(newer("assets/img/"))
    .pipe(
      graphicsMagick(function(gmfile) {
        // console.warn(gmfile.source)
        gmfile.setFormat("jpg").quality(90);
        var width = 1600;
        if (gmfile.source.includes("posts")) {
          width = 800;
        }
        return gmfile.resize(width);
      })
    )
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest("assets/img/"));
}

function watch(done) {
  // gulp.watch("_site/css/main.css", gulp.series(processStyles));
  gulp.watch("src/js/**/*.js", gulp.series(processScripts));
  gulp.watch("src/img/**/*.{jpg,png,gif}", gulp.series(processImages));
  gulp.watch("_site/**/*.*", { delay: 1000 }).on("change", browserSync.reload);
  done();
}

gulp.task("default", gulp.series(startBrowserSync, watch, jekyllBuild, processImages, processScripts, processStyles));
