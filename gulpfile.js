const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

// Tarea para compilar SASS a CSS
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS()) // Minimiza el CSS
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Tarea para minimizar JavaScript
gulp.task('minify-js', function() {
    return gulp.src('src/js/**/*.js') 
        .pipe(uglify()) // Minifica los archivos JS
        .pipe(gulp.dest('dist/js')); 
});


// Tarea para optimizar imágenes con gulp-image
gulp.task('optimize-images', async function() {
    const image = (await import('gulp-image')).default;
    return gulp.src('src/images/**/*')
        .pipe(image())
        .pipe(gulp.dest('dist/images'));
});

// Tarea para convertir imágenes a WebP con gulp-webp
gulp.task('convert-to-webp', async function() {
    const webp = (await import('gulp-webp')).default;
    return gulp.src('dist/images/**/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(gulp.dest('dist/images/webp'));
});

// Tarea para copiar archivos SVG a dist
gulp.task('copy-svg', function() {
    return gulp.src('src/images/**/*.svg') 
        .pipe(gulp.dest('dist/images'));
});

// Tarea para copiar archivos HTML a dist
gulp.task('minify-html', () => {
    return gulp.src('src/*.html')
      .pipe(htmlmin({ collapseWhitespace: true, removeComments: true })) // Minimiza el HTML
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream()); 
  });

// Inicia el servidor de BrowserSync
gulp.task('serve', function(done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
});

// Tarea para recargar el navegador
gulp.task('reload', function(done) {
    browserSync.reload();
    done();
});

// Configura las tareas de vigilancia
gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('minify-js', 'reload'));
    gulp.watch('src/images/**/*', gulp.series('optimize-images', 'convert-to-webp', 'reload', 'copy-svg'));
    gulp.watch('src/*.html', gulp.series('minify-html'));
    gulp.watch('src/images/**/*.svg', gulp.series('copy-svg'));
});

gulp.task('images', gulp.series('optimize-images', 'convert-to-webp', 'copy-svg'));

gulp.task('default', gulp.series('minify-html', 'minify-js', 'copy-svg', 'serve', 'watch'));
