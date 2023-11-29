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

const sass = gulpSass(dartSass);
const sites = 'cache/';
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
		dest: sites + 'css/temp/'
	},
	css: {
		src: sites + 'css/temp/*.css',
		dest: sites + 'css/'
	},
	js: {
		src: 'src/js/main.js',
		dest: sites + 'js/'
	},
	html: {
		src: 'src/**/*.{html,md,njk}',
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
		.pipe(gulp.dest(paths.js.dest));
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
		.pipe(gulp.dest(paths.css.dest));
}

function image() {
	return gulp.src(paths.image.src, { since: gulp.lastRun(image) })
		.pipe(webp())
		.pipe(gulp.dest(paths.image.dest));
}

function svgsmall() {
	return gulp.src(paths.svgsmall.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#2B2727', 'currentColor'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgsmall.dest));
}
function svgplain() {
	return gulp.src(paths.svgplain.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgplain.dest));
}
function svgmedium() {
	return gulp.src(paths.svgmedium.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgmedium.dest));
}
function svgshadow() {
	return gulp.src(paths.svgshadow.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(replace('#0057F2', 'var(--neon-blue)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgshadow.dest));
}
function svgwide() {
	return gulp.src(paths.svgwide.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--white-normal)'))
		.pipe(replace('#2B2727', 'var(--dark-normal)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgwide.dest));
}

function copy_svg() {
	return gulp.src(paths.staticsvg.src, { since: gulp.lastRun(copy_svg) })
		.pipe(gulp.dest(paths.staticsvg.dest));
}
function copy_font() {
	return gulp.src(paths.font.src, { since: gulp.lastRun(copy_font) })
		.pipe(gulp.dest(paths.font.dest));
}
function copy_html() {
	return gulp.src(paths.html.src, { since: gulp.lastRun(copy_html) })
		.pipe(gulp.dest(paths.html.dest));
}

function development() {
	gulp.watch(paths.font.src, { events: 'all', ignoreInitial: false }, gulp.series(copy_font));
	gulp.watch(paths.svgsmall.src, { events: 'all', ignoreInitial: false }, svgsmall);
	gulp.watch(paths.svgmedium.src, { events: 'all', ignoreInitial: false }, svgmedium);
	gulp.watch(paths.svgplain.src, { events: 'all', ignoreInitial: false }, svgplain);
	gulp.watch(paths.svgshadow.src, { events: 'all', ignoreInitial: false }, svgshadow);
	gulp.watch(paths.svgwide.src, { events: 'all', ignoreInitial: false }, svgwide);
	gulp.watch(paths.staticsvg.src, { events: 'all', ignoreInitial: false }, copy_svg);
	gulp.watch(paths.scss.src, { events: 'all', ignoreInitial: false }, scss_dev);
	gulp.watch(paths.css.src, { events: 'all', ignoreInitial: false }, css_prefix_dev);
	gulp.watch(paths.js.src, { events: 'all', ignoreInitial: false }, js_dev);
	gulp.watch(paths.html.src, { events: 'all', ignoreInitial: false }, copy_html);
}

gulp.task('webp', gulp.series(image));
gulp.task('dev', gulp.parallel(development));
gulp.task('prod', gulp.series(
	copy_font,
	svgsmall,
	svgmedium,
	svgplain,
	svgshadow,
	svgwide,
	copy_svg,
	image,
	scss_prod,
	css_prefix_prod,
	js_prod,
	copy_html
));
gulp.task('default', gulp.series('dev'));