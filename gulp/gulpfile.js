// gulpのメソッド呼び出し
const { src, dest, watch, series, parallel } = require("gulp");

// 入出力先指定
const srcBase = "../src";
const distBase = "../assets";
const srcPath = {
  css: srcBase + "/sass/**/*.scss",
  img: srcBase + "/img/**/*",
  html: srcBase + "/**/*.html",
  php: srcBase + "/**/*.php",
  js: srcBase + "/js/**/*.js",
};
const distPath = {
  css: distBase + "/css/",
  img: distBase + "/img/",
  html: distBase + "/**/*.html",
  js: distBase + "/js/",
  php: distBase + "/**/*.php",
};

// ローカルサーバー立ち上げ
const browserSync = require("browser-sync").create();
const connect = require("gulp-connect-php");
const usePhp = false; // PHPを使用する場合はtrueにする
const connectOption = {
  base: distBase,
  port: 8001,
  keepalive: true,
};

const serve = (done) => {
  if (usePhp) {
    connect.server(connectOption, function () {
      browserSync.init({
        proxy: "127.0.0.1:8001", // PHPサーバーのアドレス
      });
    });
  } else {
    browserSync.init({
      server: {
        baseDir: distBase, // HTMLファイルのディレクトリ
      },
    });
  }
  done();
};

const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// htmlの整形
const htmlbeautify = require("gulp-html-beautify");
const htmlBeautify = () => {
  return src(srcPath.html)
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 1,
        preserve_newlines: true,
        unformatted: true,
        end_with_newline: true,
      })
    )
    .pipe(dest(distBase));
};

// phpの整形
const php = () => {
  return src(srcPath.php).pipe(dest(distBase));
};

// Sassコンパイル
const sass = require('gulp-dart-sass');
const sassGlob = require("gulp-sass-glob-use-forward");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
const cssDeclarationSorter = require("css-declaration-sorter");
const browsers = [
  "last 2 versions",
  "> 5%",
  "ie = 11",
  "not ie <= 10",
  "ios >= 8",
  "and_chr >= 5",
  "Android >= 5",
];

const cssSass = (isProduction = false) => {
  const sassOptions = isProduction ? { outputStyle: "compressed" } : { outputStyle: "expanded" };
  const postcssPlugins = [cssnext({ features: { rem: true } }, browsers), cssDeclarationSorter({ order: "alphabetical" })];

  return src(srcPath.css, { sourcemaps: !isProduction })
    .pipe(sassGlob())
    .pipe(sass.sync(sassOptions).on("error", sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(dest(distPath.css, { sourcemaps: "." }))
    .pipe(notify({ message: "Sassをコンパイルしました！", onLast: true }));
};

// 画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

const imgImagemin = async (done) => {
  const webp = (await import("gulp-webp")).default;

  return src(srcPath.img)
    .pipe(
      imagemin(
        [
          imageminMozjpeg({ quality: 80 }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false, // viewBox属性を削除しない
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .on('error', (err) => {
      console.error('Error in imagemin task', err.toString());
      done(err);
    })
    .pipe(dest(distPath.img))
    .pipe(webp({ quality: 80 }))
    .pipe(dest(distPath.img))
    .on('end', done);
};


// jsの圧縮
const uglify = require("gulp-uglify");
const jsProcess = (isProduction = false) => {
  if (isProduction) {
    return src(srcPath.js).pipe(uglify()).pipe(dest(distPath.js));
  } else {
    return src(srcPath.js).pipe(dest(distPath.js));
  }
};

// ファイルの変更を検知
const watchFiles = () => {
  watch(
    srcPath.css,
    series(() => cssSass(false), browserSyncReload)
  );
  watch(srcPath.img, series((done) => imgImagemin(done), browserSyncReload));
  watch(srcPath.html, series(htmlBeautify, browserSyncReload));
  watch(
    srcPath.js,
    series(() => jsProcess(false), browserSyncReload)
  );
  watch(srcPath.php, series(php, browserSyncReload));
};

// clean
const del = require("del");
const delPath = {
  css: distBase + "/css/common.css",
  cssMap: distBase + "/css/common.css.map",
  img: distBase + "/img/",
};
const clean = (done) => {
  del(distPath.css, { force: true });
  del(delPath.img, { force: true });
  done();
};

// buildタスク
exports.build = series(
  clean,
  htmlBeautify,
  () => jsProcess(true),
  (done) => imgImagemin(done),
  () => cssSass(true)
);

// defaultタスク
exports.default = series(
  series(
    clean,
    htmlBeautify,
    () => jsProcess(false),
    (done) => imgImagemin(done),
    () => cssSass(false)
  ),
  parallel(watchFiles, serve)
);
