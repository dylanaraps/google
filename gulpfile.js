var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-ruby-sass'),
	imagemin = require('gulp-imagemin'),
	prefix = require('gulp-autoprefixer'),
	uncss = require('gulp-uncss'),
	cssc = require('gulp-css-condense'),
	concat = require('gulp-concat'),
	concatCss = require('gulp-concat-css'),
	htmlmin = require('gulp-htmlmin'),
	browserSync = require('browser-sync');

function errorLog(error) {
	console.error.bind(error);
		this.emit('end');
}

var reload = browserSync.reload;

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function() {

    browserSync({
   	 server: "./"
    });

    gulp.watch("src/scss/**/*.scss", ['styles']);
    gulp.watch("*.html").on('change', reload);
});

// HTML Task
// Minifies Html
gulp.task('html', function() {
 	return gulp.src('src/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
    		.pipe(gulp.dest(''));
});

// Scripts Task
// Uglifies
gulp.task('scripts', function(){
	return gulp.src('src/js/*.js')
		.pipe(uglify())
		.on('error', errorLog)
		.pipe(concat('main.js'))
		.pipe(gulp.dest('js/'));
});

// Styles Task
// Compiles And Minifies Sass
gulp.task('styles', function(){
	return sass('src/scss/', {style: 'expanded', loadPath: 'src/scss/partials', verbose: 'true'})
		//.on('error', errorLog)
		.pipe(prefix('> 5%'))
		.pipe(uncss({
           		html: ['src/*.html']
      		}))
        	.pipe(concatCss("main.css"))
       		.pipe(cssc())
		.pipe(gulp.dest('css/'))
		.pipe(reload({stream: true}));
})

// Image Task
// Compress Images
gulp.task('images', function(){
	return gulp.src('src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('img/'));
});

// Watch Task
// Watches all src files
gulp.task('watch', ['serve'], function(){
		gulp.watch('src/*.html', ['html']);
		gulp.watch('src/js/*.js', ['scripts']);
		gulp.watch('src/scss/**/*', ['styles']);
		gulp.watch('src/img/*', ['images']);
});


gulp.task('default', ['serve', 'html', 'scripts', 'styles', 'images', 'watch']);
