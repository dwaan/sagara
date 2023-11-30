import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import webpack from 'webpack-stream';
import webp from 'gulp-webp';
import svgmin from 'gulp-svgmin';
import autoprefixer from 'gulp-autoprefixer';
import svgstore from 'gulp-svgstore';
import replace from 'gulp-replace';
import browserSyncModule from 'browser-sync';
import { exec } from 'child_process';

const browserSync = browserSyncModule.create();
const sass = gulpSass(dartSass);
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
	svgwide: {
		src: 'src/img/icons/wide/*.svg',
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
	scss: {
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
		src: 'sites/**/*.html'
	},
	font: {
		src: 'node_modules/@fontsource-variable/golos-text/files/golos-text-latin-*.woff2',
		dest: sites + "fonts"
	},
	meta: {
		src: 'src/meta/*',
		dest: sites
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
		.pipe(gulp.dest(paths.js.dest));
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

function scss_prod() {
	return gulp.src(paths.scss.src)
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat("bundle.css"))
		.pipe(gulp.dest(paths.scss.dest));
}
function scss_dev() {
	return gulp.src(paths.scss.src)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat("bundle.css"))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.scss.dest));
}

function css_prefix_prod() {
	return gulp.src(paths.css.src)
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.css.dest));
}
function css_prefix_dev() {
	return gulp.src(paths.css.src)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.css.dest))
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
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgplain.dest))
		.pipe(browserSync.stream());
}
function svgmedium() {
	return gulp.src(paths.svgmedium.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgmedium.dest))
		.pipe(browserSync.stream());
}
function svgshadow() {
	return gulp.src(paths.svgshadow.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(replace('#0057F2', 'var(--svg-stroke-blue)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgshadow.dest))
		.pipe(browserSync.stream());
}
function svgwide() {
	return gulp.src(paths.svgwide.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgwide.dest))
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
function copy_meta() {
	return gulp.src(paths.meta.src, { since: gulp.lastRun(copy_meta) })
		.pipe(gulp.dest(paths.meta.dest))
		.pipe(browserSync.stream());
}

function html() {
	return gulp.src(paths.html.src, { since: gulp.lastRun(html) })
		.pipe(browserSync.stream());
}

// function eleventy_dev(cb) {
// 	return exec('npx @11ty/eleventy --serve', (err, stdout, stderr) => {
// 		console.log(stdout);
// 		console.error(stderr);
// 		cb(err);
// 	});
// }
// function eleventy_prod(cb) {
// 	return exec('npx @11ty/eleventy', (err, stdout, stderr) => {
// 		console.log(stdout);
// 		console.error(stderr);
// 		cb(err);
// 	});
// }

function development(cb) {
	// // Starting 11ty server at 8080
	// eleventy_dev();

	// Proxy eleventy server
	browserSync.init({
		open: false,
		stream: true,
		proxy: 'http://localhost:8080'
	});

	gulp.watch(paths.image.src, { events: 'all', ignoreInitial: false }, image);
	gulp.watch(paths.font.src, { events: 'all', ignoreInitial: false }, copy_font);
	gulp.watch(paths.meta.src, { events: 'all', ignoreInitial: false }, copy_meta);
	gulp.watch(paths.svgsmall.src, { events: 'all', ignoreInitial: false }, svgsmall);
	gulp.watch(paths.svgmedium.src, { events: 'all', ignoreInitial: false }, svgmedium);
	gulp.watch(paths.svgplain.src, { events: 'all', ignoreInitial: false }, svgplain);
	gulp.watch(paths.svgshadow.src, { events: 'all', ignoreInitial: false }, svgshadow);
	gulp.watch(paths.svgwide.src, { events: 'all', ignoreInitial: false }, svgwide);
	gulp.watch(paths.staticsvg.src, { events: 'all', ignoreInitial: false }, copy_svg);
	gulp.watch(paths.scss.src, { events: 'all', ignoreInitial: false }, scss_dev);
	gulp.watch(paths.css.src, { events: 'all', ignoreInitial: false }, css_prefix_dev);
	gulp.watch(paths.js.src, { events: 'all', ignoreInitial: false }, js_dev);
	gulp.watch(paths.html.src, { events: 'all', ignoreInitial: false }, html);

	cb();
}

gulp.task('webp', gulp.series(image));
gulp.task('dev', gulp.parallel(development));
gulp.task('prod', gulp.series(
	copy_font,
	copy_meta,
	svgsmall,
	svgmedium,
	svgplain,
	svgshadow,
	svgwide,
	copy_svg,
	image,
	scss_prod,
	css_prefix_prod,
	js_prod
));
gulp.task('default', gulp.series('dev'));