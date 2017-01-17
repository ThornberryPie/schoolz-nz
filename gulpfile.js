// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'scripts/angular-1.2.5.min.js',
        //'../build/scripts/ng-map.min.js',
        'app.js',
        'directives/map_controller.js',
        'directives/map.js',
        'services/geo_coder.js',
        'services/navigator_geolocation.js',
        'services/attr2_options.js',
				'scripts/markerclusterer_packed.js'
    ])
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Compile SASS
gulp.task('sass', function() {
    return sass('sass/style.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

// Watch task
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('scripts/*.js', ['scripts']);
  gulp.watch('data/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('sass/*.scss', ['sass']);
  //Add image optimisation

});

// Default Task
gulp.task('default', ['scripts', 'sass', 'watch']);
