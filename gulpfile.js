import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import fileinclude from 'gulp-file-include';
import browserSync from 'browser-sync';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import webpack from 'webpack-stream';
import webp from 'gulp-webp';
import svgmin from 'gulp-svgmin';
import autoprefixer from 'gulp-autoprefixer';
import svgstore from 'gulp-svgstore';
import replace from 'gulp-replace';

const sass = gulpSass(dartSass);
const siteUrl = 'http://localhost:8080/';
const sites = 'sites/';
const img = sites + 'img/';
const svgminoption = {
	multipass: true,
	js2svg: {
		pretty: false,
		indent: 2
	}
};
const paths = {
	svgsmall: {
		src: 'src/img/icons/small/*.svg',
		dest: img + 'icons/'
	},
	svgplain: {
		src: 'src/img/icons/plain/*.svg',
		dest: img + 'icons/'
	},
	svgmedium: {
		src: 'src/img/icons/medium/*.svg',
		dest: img + 'icons/'
	},
	svgshadow: {
		src: 'src/img/icons/shadow/*.svg',
		dest: img + 'icons/'
	},
	staticsvg: {
		src: 'src/img/*.svg',
		dest: img
	},
	image: {
		src: 'src/img/**/*.{png,jpg,jpeg,gif}',
		dest: img
	},
	sass: {
		src: ['node_modules/normalize.css/normalize.css', 'src/css/**/*.scss'],
		dest: 'cache/css/'
	},
	css: {
		src: 'cache/css/*.css',
		dest: sites + 'css/'
	},
	js: {
		src: 'src/js/main.js',
		dest: sites + 'js/'
	},
	html: {
		src: 'src/**/*.html',
		parse: 'src/*.html',
		dest: sites
	},
	font: {
		src: 'node_modules/@fontsource-variable/golos-text/files/golos-text-latin-*.woff2',
		dest: sites + "fonts"
	}
};

function js_prod() {
	return gulp.src(paths.js.src, { allowEmpty: true })
		.pipe(webpack({
			mode: 'production',
			output: {
				filename: 'bundle.js',
				clean: true
			}
		}))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(browserSync.stream());
}
function js_dev() {
	return gulp.src(paths.js.src, { allowEmpty: true })
		.pipe(webpack({
			devtool: 'source-map',
			mode: 'production',
			output: {
				filename: 'bundle.js',
				clean: true
			}
		}))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(browserSync.stream());
}

function css_prod() {
	return gulp.src(paths.sass.src)
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat("bundle.css"))
		.pipe(gulp.dest(paths.sass.dest));
}
function css_dev() {
	return gulp.src(paths.sass.src)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat("bundle.css"))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.sass.dest));
}

function css_prefix_prod() {
	return gulp.src(paths.css.src)
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browserSync.stream());
}
function css_prefix_dev() {
	return gulp.src(paths.css.src)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browserSync.stream());
}

function html() {
	return gulp.src(paths.html.parse, { since: gulp.lastRun(html) })
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.stream());
}

function image() {
	return gulp.src(paths.image.src, { since: gulp.lastRun(image) })
		.pipe(webp())
		.pipe(gulp.dest(paths.image.dest))
		.pipe(browserSync.stream());
}

function svgsmall() {
	return gulp.src(paths.svgsmall.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#2B2727', 'currentColor'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgsmall.dest))
		.pipe(browserSync.stream());
}
function svgplain() {
	return gulp.src(paths.svgplain.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--light-white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgplain.dest))
		.pipe(browserSync.stream());
}
function svgmedium() {
	return gulp.src(paths.svgmedium.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgmedium.dest))
		.pipe(browserSync.stream());
}
function svgshadow() {
	return gulp.src(paths.svgshadow.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--light-white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(replace('#0057F2', 'var(--neon-blue)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgshadow.dest))
		.pipe(browserSync.stream());
}

function copy_svg() {
	return gulp.src(paths.staticsvg.src, { since: gulp.lastRun(copy_svg) })
		.pipe(gulp.dest(paths.staticsvg.dest))
		.pipe(browserSync.stream());
}
function copy_font() {
	return gulp.src(paths.font.src, { since: gulp.lastRun(copy_font) })
		.pipe(gulp.dest(paths.font.dest))
		.pipe(browserSync.stream());
}

function server() {
	connect.server({
		livereload: true,
		root: 'sites/',
		port: 8080
	}, function () {
		browserSync.init({
			open: false,
			proxy: siteUrl,
			serveStatic: ['./'],
			serveStaticOptions: {
				extensions: ['html']
			},
			middleware: [
				function (req, _, next) {
					const notHTML = [".css", ".js", ".jpg", ".jpeg", ".webp", ".svg", ".png", ".woff2", ".map"];
					function doesNotEndWithAnyExtension(str, prohibitedExtensions) {
						for (const extension of prohibitedExtensions) {
							if (str.endsWith(extension)) {
								return false; // Return early if a match is found
							}
						}
						return true; // If no match is found, the string does not end with any prohibited extension
					}

					// Convert *.html to extensionless counterpart
					if (req.url.endsWith('.html')) {
						req.url = req.url.slice(0, -5); // remove the '.html' extension
					}
					// Handle the default route by redirecting to 404.html
					else if (doesNotEndWithAnyExtension(req.url, notHTML)) {
						req.url = '/index.html';
					}

					next();
				}
			]
		});
	});
}
function development() {
	server();

	gulp.watch(paths.font.src, { events: 'all', ignoreInitial: false }, gulp.series(copy_font));
	gulp.watch(paths.svgsmall.src, { events: 'all', ignoreInitial: false }, svgsmall);
	gulp.watch(paths.svgmedium.src, { events: 'all', ignoreInitial: false }, svgmedium);
	gulp.watch(paths.svgplain.src, { events: 'all', ignoreInitial: false }, svgplain);
	gulp.watch(paths.svgshadow.src, { events: 'all', ignoreInitial: false }, svgshadow);
	gulp.watch(paths.staticsvg.src, { events: 'all', ignoreInitial: false }, copy_svg);
	gulp.watch(paths.image.src, { events: 'all', ignoreInitial: false }, image);
	gulp.watch(paths.sass.src, { events: 'all', ignoreInitial: false }, css_dev);
	gulp.watch(paths.css.src, { events: 'all', ignoreInitial: false }, css_prefix_dev);
	gulp.watch(paths.js.src, { events: 'all', ignoreInitial: false }, js_dev);
	gulp.watch(paths.html.src, { events: 'all', ignoreInitial: false }, html);
}

gulp.task('dev', gulp.parallel(development));
gulp.task('prod', gulp.series(
	copy_font,
	svgsmall,
	svgmedium,
	svgplain,
	svgshadow,
	copy_svg,
	image,
	css_prod,
	css_prefix_prod,
	js_prod,
	html
));
gulp.task('default', gulp.series('dev'));