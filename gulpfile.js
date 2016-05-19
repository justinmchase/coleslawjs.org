var gulp = require('gulp')
var babel = require('gulp-babel')
var eslint = require('gulp-eslint')
var less = require('gulp-less')
var gutil = require('gulp-util')
var del = require('del')
var sourcemaps = require('gulp-sourcemaps')
var gls = require('gulp-live-server')
var runSequence = require('run-sequence')
var es = require('event-stream')
var coleslaw = require('gulp-coleslaw')

/* MODELS */
gulp.task('coleslaw', () => {
  return gulp
    .src('models/**/*.cls')
    .pipe(coleslaw())
    .pipe(gulp.dest('build/app/models'))
    .pipe(gulp.dest('build/server/models'))
})

/* TEST */
gulp.task('test:server', ['build:server'], () => {
  // todo...
})

gulp.task('test:app', ['build:app'], () => {
  // todo...
})

gulp.task('test', ['build', 'test:server', 'test:app'])

/* BUILD */
gulp.task('build:app', () => {
  return gulp
    .src('app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
      plugins: [
        'angular2-annotations',
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-flow-strip-types'
      ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/app'))
})

gulp.task('build:server', () => {
  return gulp
    .src('server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/server'))
})

gulp.task('build', ['build:server', 'build:app', 'coleslaw', 'resources'])

/* RESOURCES */
gulp.task('dependencies', () => {
  var dependencies = {
    '@angular/**/*.js': '@angular',
    'bootstrap/dist/js/bootstrap.min.js': 'bootstrap',
    'rxjs/**/*.js': 'rxjs',
    'es6-shim/es6-shim.min.js': '',
    'zone.js/dist/zone.js': '',
    'reflect-metadata/Reflect.js': '',
    'systemjs/dist/system.src.js': ''
  }

  var streams = Object
    .keys(dependencies)
    .map(key => gulp.src(`node_modules/${key}`).pipe(gulp.dest(`build/app/d/${dependencies[key]}`)))

  return es.merge(streams)
})

gulp.task('images', () => {
  return gulp
    .src('app/images/**/*')
    .pipe(gulp.dest('build/app/images'))
})

gulp.task('templates', () => {
  return gulp
    .src(['app/**/*.html'])
    .pipe(gulp.dest('build/app'))
})

gulp.task('styles', () => {
  return gulp
    .src('app/**/*.less')
    .pipe(less({
      paths: [
        '.',
        'node_modules/bootstrap-less'
      ]
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('build/app'))
})

gulp.task('resources', ['styles', 'templates', 'images', 'dependencies'])

/* LINT */
gulp.task('lint', () => {
  var sources = [
    'gulpfile.js',
    'server/**/*.js',
    'app/**/*.js',
    'migrations/**/*.js'
  ]

  return gulp
    .src(sources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/* CLEAN */
gulp.task('clean', () => {
  return del('build')
})

/* WATCH */
var server = null
gulp.task('serve', () => {
  if (!server) server = gls.new('build/server/index.js')
  if (server) server.start()
})

gulp.task('watch', (done) => {
  gulp.watch('gulpfile.js', gulp.seq)
  gulp.watch(['models/**/*.cls'], ['coleslaw', 'serve', 'test:server'])
  gulp.watch(['server/**/*.js'], ['build:server', 'serve', 'lint', 'test:server'])
  gulp.watch(['app/**/*.js'], ['build:app', 'lint', 'test:app'])
  gulp.watch('app/**/*.less', ['styles'])
  gulp.watch('app/**/*.html', ['templates'])
  gulp.watch('app/images/**/*', ['images'])
  runSequence('clean', 'build', 'test', 'lint', 'serve', done)
})

/* DEFAULT */
gulp.task('default', (done) => {
  runSequence('clean', 'build', 'test', 'lint', done)
})
