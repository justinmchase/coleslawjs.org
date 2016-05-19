System.config({
  baseURL: '.',
  defaultJSExtensions: true,
  meta: {
    '*.js': { format: 'cjs' } // CommonJS
  },
  map: {
    app: '.',
    'bootstrap': 'd/bootstrap/bootstrap.min.js',
    'rxjs': 'd/rxjs',
    '@angular/common': 'd/@angular/common/index.js',
    '@angular/compiler': 'd/@angular/compiler/index.js',
    '@angular/core': 'd/@angular/core/index.js',
    '@angular/http': 'd/@angular/http/index.js',
    '@angular/platform-browser': 'd/@angular/platform-browser/index.js',
    '@angular/platform-browser-dynamic': 'd/@angular/platform-browser-dynamic/index.js',
    '@angular/router': 'd/@angular/router/index.js',
    '@angular/router-deprecated': 'd/@angular/router-deprecated/index.js',
    '@angular/upgrade': 'd/@angular/upgrade/index.js'
  },
  packages: {
    'app': {
      main: 'index.js',
      format: 'register',
      defaultExtension: 'js'
    }
  }
})
