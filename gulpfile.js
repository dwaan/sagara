import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import connect from 'gulp-connect-php';
import browserSync from 'browser-sync';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import webpack from 'webpack-stream';
import webp from 'gulp-webp';
import svgmin from 'gulp-svgmin';
import autoprefixer from 'gulp-autoprefixer';
import gulpMode from 'gulp-mode';
import svgstore from 'gulp-svgstore';
import replace from 'gulp-replace';
import { spawn } from 'child_process';

const sass = gulpSass(dartSass);
const mode = gulpMode();
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

var paths = {
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
	php: {
		src: 'src/*.php',
		dest: sites
	},
	font: {
		src: 'node_modules/@fontsource-variable/golos-text/files/golos-text-latin-*.woff2',
		dest: sites + "fonts"
	}
};

function js() {
	return gulp.src(paths.js.src)
		.pipe(mode.development(webpack({
			devtool: 'source-map',
			mode: 'production',
			output: {
				filename: 'bundle.js',
				clean: true
			}
		})))
		.pipe(mode.production(webpack({
			mode: 'production',
			output: {
				filename: 'bundle.js',
				clean: true
			}
		})))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(browserSync.stream());
}

function css() {
	return gulp.src(paths.sass.src)
		.pipe(mode.development(sourcemaps.init({ loadMaps: true })))
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat("bundle.css"))
		.pipe(mode.development(sourcemaps.write('.')))
		.pipe(gulp.dest(paths.sass.dest));
}

function css_prefix() {
	return gulp.src(paths.css.src)
		.pipe(mode.development(sourcemaps.init({ loadMaps: true })))
		.pipe(autoprefixer())
		.pipe(mode.development(sourcemaps.write('.')))
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browserSync.stream());
}

function php() {
	return gulp.src(paths.php.src, { since: gulp.lastRun(php) })
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(paths.php.dest))
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

function reload() {
	process.argv.shift();
	spawn(process.argv.shift(), process.argv, { stdio: 'inherit' });
	process.exit();
}

export default () => {
	connect.server({
		hostname: "0.0.0.0",
		port: 8080,
		base: "sites/",
		router: "router.php",
		keepalive: true,
		stdio: "ignore",
		debug: false
	}, function () {
		browserSync.init({
			open: false,
			proxy: siteUrl

		});
	});
	gulp.watch(paths.font.src, { events: 'all', ignoreInitial: false }, gulp.series(copy_font));
	gulp.watch(paths.svgsmall.src, { events: 'all', ignoreInitial: false }, svgsmall);
	gulp.watch(paths.svgmedium.src, { events: 'all', ignoreInitial: false }, svgmedium);
	gulp.watch(paths.svgplain.src, { events: 'all', ignoreInitial: false }, svgplain);
	gulp.watch(paths.svgshadow.src, { events: 'all', ignoreInitial: false }, svgshadow);
	gulp.watch(paths.staticsvg.src, { events: 'all', ignoreInitial: false }, copy_svg);
	gulp.watch(paths.image.src, { events: 'all', ignoreInitial: false }, image);
	gulp.watch(paths.sass.src, { events: 'all', ignoreInitial: false }, css);
	gulp.watch(paths.css.src, { events: 'all', ignoreInitial: false }, css_prefix);
	gulp.watch(paths.js.src, { events: 'all', ignoreInitial: false }, js);
	gulp.watch(paths.php.src, { events: 'all', ignoreInitial: false }, php);

	gulp.watch('gulpfile.js', reload);
};