const { src, dest, watch, series } = require("gulp");

//HTML
const htmlmin = require('gulp-htmlmin');

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Javascript
const terser = require("gulp-terser-js");

function html() {
  return src("*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("../server/"));
}

function css() {
  return src("css/*.css")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("../server/build/css"));
}

function imagenes() {
  return src("img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("../server/build/img"));
}

function versionWebp() {
  const opciones = {
    quality: 50,
  };
  return src("img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("../server/build/img"));
}

function versionAvif() {
  const opciones = {
    quality: 50,
  };
  return src("img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("../server/build/img"));
}

function javascript(done) {
  src("js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("../server/build/js"));

  done();
}

function dev() {
  watch("js/**/*.js", javascript);
  watch("*.html", html);
  watch("css/*.css", css);
  watch("img/**/*", imagenes);
  watch("img/**/*", versionAvif);
  watch("img/**/*", versionWebp);
}

module.exports = {
  html, 
  css, 
  dev, 
  imagenes, 
  versionWebp,
  versionAvif, 
  javascript,
  deploy: series(
    html,
    css,
    javascript,
    imagenes,
    versionWebp,
    versionAvif,
    dev
  ),
}

exports.default = series(
  html,
  css,
  javascript,
  imagenes,
  versionWebp,
  versionAvif,
  dev
);
