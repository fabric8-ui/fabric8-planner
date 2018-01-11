
/*
 * Main build file for fabric8-planner.
 * ---
 * Each main task has parametric handlers to achieve different result.
 * Check out the sections for task variants & accepted task arguments.
 */

// Require primitives
var del = require('del')
  , path = require('path')
  , argv = require('yargs').argv
  , process = require('child_process')
  , runSequence = require('run-sequence')
  ;

// Require gulp extension modules
var gulp = require('gulp')
  , ngc = require('gulp-ngc')
  , less = require('gulp-less')
  , util = require('gulp-util')
  , changed = require('gulp-changed')
  , lesshint = require('gulp-lesshint')
  , concat = require('gulp-concat-css')
  , sourcemaps = require('gulp-sourcemaps')
  , replace = require('gulp-string-replace')
  ;

// Requirements with special treatments
var KarmaServer = require('karma').Server
  , LessAutoprefix = require('less-plugin-autoprefix')
  , autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] })
  ;

// Not sure if var or const
var appSrc = 'src';
var distPath = 'dist';
var distWatch = 'watch';

/*
 * Utility functions
 */

// Global namespace to contain the utility functions
let utils = {};

// Copy files to the distPath
utils.copyToDist = function (srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      // Save directly to dist; @TODO: rethink the path evaluation strategy
      return distPath + file.base.slice(__dirname.length + 'src/'.length);
    }));
}

// Copy files from the distPath to the distWatch.
utils.updateDistWatch = function () {
  return gulp
    .src(distPath + '/**')
    .pipe(changed(distWatch))
    .pipe(gulp.dest(distWatch));
}

// Transpile given LESS source(s) to CSS, storing results to distPath.
utils.transpileLESS = function (src, debug) {
  var opts = {
    // THIS IS NEEDED FOR REFERENCE
    // paths: [ path.join(__dirname, 'less', 'includes') ]
  }
  return gulp.src(src)
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(lesshint({
      configPath: './.lesshintrc' // Options
    }))
    .pipe(lesshint.reporter()) // Leave empty to use the default, "stylish"
    .pipe(lesshint.failOnError()) // Use this to fail the task on lint errors
    .pipe(sourcemaps.init())
    .pipe(less(opts))
    //.pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return distPath + file.base.slice(__dirname.length + 'src/'.length);
  }));
}

/*
 * Global namespace to contain reusable routines
 */

let mach = {};


/*
 * Task declarations
 */

// Clean
gulp.task('build', function () {

  // app (default)

  // image

  // release

  // tarball

  // validate

  // watch

});

// Clean
gulp.task('clean', function () {

  // all (default): set flags to validate following conditional cleanups
  if (
    !argv.cache &&
    !argv.config &&
    !argv.dist &&
    !argv.images &&
    !argv.modules &&
    !argv.temp) {
      // if none of the known sub-task parameters for `clean` was provided
      // i.e. only `gulp clean` was called, then set default --all flag ON
      console.log(argv.all);
      argv.all = true;
      console.log(argv.all);
  }

  if (argv.all) {
    // Exclusively set all subroutine parameters ON for `gulp clean --all`
    argv.cache = argv.config = argv.dist = argv.images = argv.modules = argv.temp = true;
  }

  // cache
  if (argv.cache) process.exec('npm cache clean');

  // config
  // if (argv.config) { subroutine to clean config - not yet needed }

  // dist
  if (argv.dist) del([distPath, distWatch]);

  // images
  if (argv.images) {
    // Get ID of the images having 'fabric8-planner' in its name
    process.exec('sudo docker ps -aq --filter "name=fabric8-planner"', function (e, containerID) {
      if (e) {
        console.log(e);
        return;
      }

      // @TODO: wrap this in a try-catch block to avoid unexpected behavior
      process.exec('sudo docker stop ' + containerID);
      process.exec('sudo docker rm '   + containerID);

      // Container has been killed, safe to remove image(s) with 'fabric8-planner-*' as part of their ref
      process.exec('sudo docker images -aq --filter "reference=fabric8-planner-*"', function (e, imageID) {
        if (e) {
          console.log(e);
          return;
        }

        // @TODO: wrap this in a try-catch block to avoid unexpected behavior
        process.exec('sudo docker rmi ' + imageID);
      });
    });
  }

  // modules
  if (argv.modules) del(['node_modules']);

  // temp
  if (argv.temp) del(['tmp', 'coverage', 'typings', '.sass-cache']);
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

// FIXME: why do we need that?
// replaces templateURL/styleURL with require statements in js.
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

// Transpile and minify less, storing results in distPath.
gulp.task('transpile-less', function () {
  return utils.transpileLESS(appSrc + '/**/*.less');
});

// transpiles the ts sources to js using the tsconfig.
gulp.task('transpile', function () {
  return ngc('tsconfig.json')
});

// copies the template html files to distPath.
gulp.task('copy-html', function () {
  return utils.copyToDist([
    'src/**/*.html'
  ]);
});

// copies the static asset files to distPath.
gulp.task('copy-static-assets', function () {
  return gulp.src([
    'LICENSE',
    'README.adoc',
    'package.json',
  ]).pipe(gulp.dest(distPath));
});

// Put the less files back to normal
gulp.task('build:library',
  [
    'transpile',
    'post-transpile',
    'transpile-less',
    'copy-html',
    'copy-static-assets'
  ]);

// Main build goal, builds the release library.
gulp.task('build', function(callback) {
  runSequence('clean:dist',
              'build:library',
              callback);
});

// Watch Tasks follow.

gulp.task('copy-watch', ['post-transpile'], function () {
  return utils.updateDistWatch();
});

gulp.task('copy-watch-all', ['build:library'], function () {
  return utils.updateDistWatch();
});

gulp.task('watch', ['build:library', 'copy-watch-all'], function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['transpile', 'post-transpile', 'copy-watch']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Compiling.');
  });
  gulp.watch([appSrc + '/app/**/*.less']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    utils.transpileLESS(e.path);
    utils.updateDistWatch();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    utils.copyToDist(e.path);
    utils.updateDistWatch();
  });
  util.log('Now run');
  util.log('');
  util.log(util.colors.red('    npm link', path.resolve(distWatch)));
  util.log('');
  util.log('in the npm module you want to link this one to');
});
