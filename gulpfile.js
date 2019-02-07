var gulp = require("gulp"),
  plumber = require("gulp-plumber"),
  browserSync = require("browser-sync"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  newer = require("gulp-newer"),
  graphicsMagick = require("gulp-gm"),
  imagemin = require("gulp-imagemin"),
  imageResize = require('gulp-image-resize'),
  exec = require("child_process").exec;

/**
 * Build the Jekyll Site
 */
function jekyllBuild(done) {
  exec("bundle exec jekyll serve", function (err, stdout, stderr) {
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

// kind of strange, but works natively with gh pages
function copyStyles() {
  return gulp.src('node_modules/blueimp-gallery/css/blueimp-gallery.min.css')
    .pipe(gulp.dest('assets/css'));
}

function processScripts() {
  return gulp
    .src(["src/js/jquery.min.js", "src/js/jquery.scrollex.min.js", "src/js/jquery.scrolly.min.js", "src/js/skel.min.js", "src/js/util.js", "src/js/*.js", "node_modules/blueimp-gallery/js/blueimp-gallery.min.js"])
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("assets/js/"))
    .pipe(gulp.dest("_site/assets/js/"))
    .pipe(browserSync.stream());
}

function processImages() {
  return gulp
    .src("src/img/**/*.{jpg,JPG,png,gif}")
    .pipe(plumber())
    .pipe(newer("assets/img/"))
    .pipe(
      graphicsMagick(function (gmfile) {
        // console.warn(gmfile.source)
        gmfile.setFormat("jpg").quality(90);
        var width = 1600;
        if (gmfile.source.includes("posts")) {
          width = 800;
        }
        return gmfile.resize(width);
      })
    )
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest("assets/img/"))


    //convert input.jpg -thumbnail x200 -resize '200x<' -resize 50% -gravity center -crop 100x100+0+0 +repage -format jpg -quality 91 square.jpg
    //convert -define jpeg:size=200x200 hatching_orig.jpg  -thumbnail 100x100^ -gravity center -extent 100x100  cut_to_fit.gif
    // thumbnails
    // .pipe(
    //   graphicsMagick(function(gmfile) {
    //     // console.warn(gmfile.source)
    //     gmfile.setFormat("jpg").quality(90);

    //     // return gmfile.gravity("Center").resize(250).crop(250, 250);
    //     // return gmfile.gravity('Center').thumb(250, 250)
    //     // return gmfile.resize(250);
    //   })
    // )
    .pipe(imageResize({
      width: 250,
      height: 250,
      crop: true,
      upscale: false
    }))
    .pipe(gulp.dest("assets/img/thumbnails/"));
}

function watch(done) {
  // gulp.watch("src/css/main.scss", gulp.series(processStyles));
  gulp.watch("src/js/**/*.js", gulp.series(processScripts));
  gulp.watch("src/img/**/*.{jpg,png,gif}", gulp.series(processImages));
  gulp.watch("_site/**/*.*", {
    delay: 1000
  }).on("change", browserSync.reload);
  done();
}

gulp.task("default", gulp.series(copyStyles, startBrowserSync, watch, jekyllBuild, processScripts));