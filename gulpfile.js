var gulp = require('gulp')
var del = require('del')
var path = require('path')
var gutil = require('gulp-util')
var gls = require('gulp-live-server')
var less = require('gulp-less')
var sourcemaps = require('gulp-sourcemaps')
var typescript = require('typescript')
var ts = require('gulp-typescript')
var tslint = require('gulp-tslint')
var coleslaw = require('gulp-coleslaw')
var runSequence = require('run-sequence')

// --
// Coleslaw tasks
// --
gulp.task('coleslaw', () => {
    return gulp
        .src([
            './models/**/*.cls'
        ])
        .pipe(coleslaw())
        .pipe(gulp.dest('./build/models'))
        .pipe(gulp.dest('./public/app/models'))
})

// --
// TypeScript tasks
// --
gulp.task('typescript:lint', () => {
    return gulp.src([
            './app/**/*.ts',
            './server/**/*.ts'
        ])
        .pipe(tslint())
        .pipe(tslint.report('full', {
            summarizeFailureOutput: true
        }))
})

gulp.task('typescript:app', ['clean:app', 'typescript:lint'], () => {

    return gulp
        .src([
            './typings/browser.d.ts',
            './app/**/*.ts'
        ])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: 'es5',
            module: 'system',
            moduleResolution: 'node',
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: true,
            noImplicitAny: false,
            typescript: typescript
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/app'))
})

gulp.task('typescript:server', ['typescript:lint'], (done) => {
    return gulp
        .src([
            'typings/main.d.ts',
            'server/**/*.ts',
        ])
        .pipe(sourcemaps.init())
        .pipe(ts({
            module: 'commonjs',
            moduleResolution: 'node',
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: true,
            noImplicitAny: false,
            typescript: typescript
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
})

gulp.task('typescript', ['typescript:app', 'typescript:server'])

// --
// Resource tasks
// --
gulp.task('styles', ['clean:styles'],  function() {
    return gulp.src(['./app/**/*.less'])
        .pipe(less({
            paths: [
                '.',
                './node_modules/bootstrap-less'
            ]
        }))
        .on('error', function(err) {
            gutil.log(err)
        })
})

gulp.task('templates', ['clean:templates'],  () => {
    return gulp
        .src([
            './app/**/*.html'
        ])
        .pipe(gulp.dest('./public'))
})

gulp.task('images', ['clean:images'], function() {
    return gulp
        .src(['./app/images/**/*.*'])
        .pipe(gulp.dest('./public/images'))
})

gulp.task('fonts', ['clean:fonts'], function() {
    return gulp
        .src(['./node_modules/bootstrap-less/fonts/**/*.*'])
        .pipe(gulp.dest('./public/fonts'))
})

// --
// Clean tasks
// --
gulp.task('clean', function() {
    return gulp.start(['clean:build', 'clean:public'])
})

gulp.task('clean:build', function() {
    return del([
            './build/*'
        ])
        .then(paths => {
            console.log('Deleted /build files and folders:\n', paths.join('\n'))
        })
})

gulp.task('clean:public', function() {
    return del([
            './public/*',
            '!./public/pages'
        ])
        .then(paths => {
            console.log('Deleted /public files and folders:\n', paths.join('\n'))
        })
})

gulp.task('clean:app', function() {
    return del([
            './public/app'
        ])
        .then(paths => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

gulp.task('clean:images', function() {
    return del([
            './public/images'
        ])
        .then(paths => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

gulp.task('clean:styles', function() {
    return del([
            './public/styles'
        ]).then(paths => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

gulp.task('clean:fonts', function() {
    return del([
            './public/fonts'
        ]).then(paths => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

gulp.task('clean:templates', function() {
    return del([
            './public/templates'
        ]).then(paths => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

gulp.task('resources', (cb) => {
    runSequence('templates', 'images', 'styles', 'fonts', cb)
})

// --
// Build
// --
gulp.task('build', ['resources', 'typescript', 'coleslaw'])

// --
// Server Tasks
// --
var server = null
gulp.task('serve', ['typescript:server'], () => {
    if (!server) server = gls.new('build/index.js')
    if (server) server.start()
})

gulp.task('deleteFiles', ['typescript:server'], () => {
    return del(files)
        .then(files => {
            console.log('Deleted:\n', paths.join('\n'))
        })
})

// --
// Watch Tasks
// --
gulp.task('watch', (done) => {
    gulp.watch('./models/**/*.cls', ['coleslaw'])
    gulp.watch('./server/**/*.ts', ['serve'])
    gulp.watch('./app/**/*.less', ['styles'], (file) => {
        if (server) server.notify(file)
    })
    gulp.watch('./app/**/*.html', ['templates'], (file) => {
        if (server) server.notify(file)
    })
    gulp.watch('./app/**/*.ts', ['typescript:app'], (file) => {
        if (server) server.notify(file)
    })
    runSequence('clean', 'build', 'serve', done)
})

gulp.task('default', ['clean', 'build'])
