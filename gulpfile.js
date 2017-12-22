
/*
 * Main build file for fabric8-planner. Use the commands here to build and deploy
 * the library. See the commands below for detailed documentation.
 */

var gulp = require('gulp'),
  argv = require('yargs').argv,
  autoprefixer = require('autoprefixer'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }),
  lesshint = require('gulp-lesshint'),
  concat = require('gulp-concat-css'),
  changed = require('gulp-changed');
  del = require('del'),
  replace = require('gulp-string-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  cp = require('child_process'),
  del = require('del'),
  exec = require('gulp-exec').exec,
  KarmaServer = require('karma').Server,
  lessCompiler = require('gulp-less'),
  stylelint = require ('gulp-stylelint'),
  cssmin = require ('gulp-cssmin'),
  ngc = require('gulp-ngc'),
  path = require('path'),
  postcss = require('postcss'),
  replace = require('gulp-string-replace'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  util = require('gulp-util');

var appSrc = 'src';
var libraryDist = 'dist';
var watchDist = 'dist-watch';

/*
 * FUNCTION LIBRARY
 */

// copies files to the libraryDist directory.
function copyToDist(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length); // save directly to dist
    }));
}

// copies files from the libraryDist to the watchDist.
function updateWatchDist() {
  return gulp
    .src(libraryDist + '/**')
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}

function transpileLESS(src, debug) {
  var opts = {
   // paths: [ path.join(__dirname, 'less', 'includes') ], //THIS NEEDED FOR REFERENCE
  }
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(lessCompiler({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }).on('error', function (err) {
      // this will prevent our future watch-task from crashing on less-errors
      console.log(err);
    }))
    .pipe(cssmin().on('error', function(err) {
      console.log(err);
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length);
    }));
}

function minifyCSS(file) {
  try {
    var minifiedFile = stylus.render(file);
    minifiedFile = postcss([autoprefixer]).process(minifiedFile).css;
    minifiedFile = csso.minify(minifiedFile).css;
    return minifiedFile;
  } catch (err) {
    console.log(err);
  }
}

/*
 * TASKS
 */

// Stylelint task for build process
gulp.task('lint-less', function lintLessTask() {
  return gulp
  .src('src/**/*.less')
  .pipe(stylelint({
    failAfterError: false,
    reporters: [{
      formatter: 'string', console: true
    }]
  }));
});

// Stylelint task for npm script - uses verbose format for error messages
gulp.task('stylelint', function lintLessTask() {
  return gulp
  .src('src/**/*.less')
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{
      formatter: 'verbose', console: true
    }]
  }));
});

// require transpile to finish before the build starts the post-transpile task
gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/app/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the less-file was
    }));
});

// Transpile and minify less, storing results in libraryDist.
gulp.task('transpile-less', ['lint-less'], function () {
  return transpileLESS(appSrc + '/**/*.less');
});

// transpiles the ts sources to js using the tsconfig.
gulp.task('transpile', ['transpile-less'], function () {
  return ngc('tsconfig.json')
});

// require transpile to finish before copying the css
gulp.task('copy-css', ['transpile'], function () {
  return copyToDist([
    'src/**/*.css'
  ]);
});

// copies the template html files to libraryDist.
gulp.task('copy-html', function () {
  return copyToDist([
    'src/**/*.html'
  ]);
});

// copies the static asset files to libraryDist.
gulp.task('copy-static-assets', function () {
  return gulp.src([
    'LICENSE',
    'README.adoc',
    'package.json',
  ]).pipe(gulp.dest(libraryDist));
});

// Deletes dist directories.
gulp.task('clean:dist', function () {
  return del([
    'dist-watch',
    'dist'
  ]);
});

// Deletes npm cache.
gulp.task('clean:npmcache', function () {
  return cp.execFile('npm cache clean');
});

// Deletes and cleans all.
gulp.task('clean:all', ['clean:dist', 'clean:npmcache'], function () {
  return del([
    'node_modules',
    'coverage'
  ]);
});

// Deletes and re-installs dependencies.
gulp.task('reinstall', ['clean:all'], function () {
  return cp.execFile('npm install');
});

// Run unit tests.
gulp.task('test:unit', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Put the less files back to normal
gulp.task('build:library',
  [
    'lint-less',
    'transpile-less',
    'transpile',
    'post-transpile',
    'copy-css',
    'copy-html',
    'copy-static-assets'
  ]
);

// Main build goal, builds the release library.
gulp.task('build', function(callback) {
  runSequence('clean:dist',
              'build:library',
              callback);
});

// Watch Tasks follow.

gulp.task('copy-watch', ['post-transpile'], function () {
  return updateWatchDist();
});

gulp.task('copy-watch-all', ['build:library'], function () {
  return updateWatchDist();
});

gulp.task('watch', ['build:library', 'copy-watch-all'], function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['transpile', 'post-transpile', 'copy-watch']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Compiling.');
  });
  gulp.watch([appSrc + '/app/**/*.less', '!' + appSrc + '/assets/**/*.less'], ['transpile']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    transpileLESS(e.path);
    updateWatchDist();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    copyToDist(e.path);
    updateWatchDist();
  });
  util.log('Now run');
  util.log('');
  util.log(util.colors.red('    npm link', path.resolve(watchDist)));
  util.log('');
  util.log('in the npm module you want to link this one to');
});
