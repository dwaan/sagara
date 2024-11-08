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
import livereload from 'gulp-livereload';
import eleventy from '@11ty/eleventy';
import header from 'gulp-header';

const browserSync = browserSyncModule.create();
const sass = gulpSass(dartSass);
const src = 'src/';
const sites = 'sites/';
const img = sites + 'img/';
const elev = new eleventy();
const svgminoption = {
	multipass: true,
	js2svg: {
		pretty: false,
		indent: 2
	}
};
const paths = {
	svgsmall: {
		src: src + 'img/icons/small/*.svg',
		dest: img + 'icons/'
	},
	svgplain: {
		src: src + 'img/icons/plain/*.svg',
		dest: img + 'icons/'
	},
	svgmedium: {
		src: src + 'img/icons/medium/*.svg',
		dest: img + 'icons/'
	},
	svgshadow: {
		src: src + 'img/icons/shadow/*.svg',
		dest: img + 'icons/'
	},
	svgwide: {
		src: src + 'img/icons/wide/*.svg',
		dest: img + 'icons/'
	},
	svglogo: {
		src: src + 'img/icons/logos/*.svg',
		dest: img + 'icons/'
	},
	staticsvg: {
		src: src + 'img/*.svg',
		dest: img
	},
	image: {
		src: src + 'img/**/*.{png,jpg,jpeg,gif}',
		dest: img
	},
	scss: {
		src: ['node_modules/normalize.css/normalize.css', src + 'css/**/*.scss'],
		dest: sites + 'css/'
	},
	css: {
		src: sites + 'css/*.css',
		dest: sites + 'css/'
	},
	js: {
		src: src + 'js/main.js',
		watch: src + 'js/**/*.js',
		dest: sites + 'js/'
	},
	html: {
		src: 'sites/**/*.html',
		dest: sites
	},
	font: {
		src: 'node_modules/@fontsource-variable/golos-text/files/golos-text-latin-*.woff2',
		dest: sites + "fonts"
	},
	meta: {
		src: src + '/**/meta/*',
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
			mode: 'development',
			output: {
				filename: 'bundle.js',
				clean: true
			}
		}))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(header(`document.write('<script src="http://' + window.location.hostname + ':35729/livereload.js"></script>');`))
		.pipe(browserSync.stream())
		.pipe(livereload());
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
		.pipe(browserSync.stream())
		.pipe(livereload());
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
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgplain.dest));
}
function svgmedium() {
	return gulp.src(paths.svgmedium.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgmedium.dest));
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
		.pipe(gulp.dest(paths.svgshadow.dest));
}
function svgwide() {
	return gulp.src(paths.svgwide.src)
		.pipe(replace(' fill="none"', ''))
		.pipe(replace('#F9FAFC', 'var(--svg-fill)'))
		.pipe(replace('#2B2727', 'var(--svg-stroke)'))
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svgwide.dest));
}
function svglogo() {
	return gulp.src(paths.svglogo.src)
		.pipe(svgmin(svgminoption))
		.pipe(svgstore())
		.pipe(replace('<symbol ', '<symbol fill="none" stroke="none" '))
		.pipe(gulp.dest(paths.svglogo.dest));
}

function copy_svg() {
	return gulp.src(paths.staticsvg.src, { since: gulp.lastRun(copy_svg) })
		.pipe(gulp.dest(paths.staticsvg.dest));
}
function copy_font() {
	return gulp.src(paths.font.src, { since: gulp.lastRun(copy_font) })
		.pipe(gulp.dest(paths.font.dest));
}
function copy_meta() {
	return gulp.src(paths.meta.src, { since: gulp.lastRun(copy_meta) })
		.pipe(gulp.dest(paths.meta.dest));
}

function html() {
	return gulp.src(paths.html.src, { since: gulp.lastRun(html) })
		.pipe(replace(' src="/sites/', ' src="/'))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.stream());
}

async function eleventy_dev(server = true) {
	try {
		if (server) {
			const port = 8080;
			await elev.watch();
			await elev.serve(port);

			// Proxy eleventy server
			browserSync.init({
				open: false,
				stream: true,
				proxy: 'http://localhost:' + port
			});

			livereload.listen();
		} else {
			await elev.write();
		}
	} catch (error) {
		console.error('Error starting Eleventy server:', error);
		process.exit(1);
	}
}
async function eleventy_prod() {
	await eleventy_dev(false);
}

function development() {
	eleventy_dev();

	gulp.watch(paths.image.src, { events: 'all', ignoreInitial: false }, image);
	gulp.watch(paths.font.src, { events: 'all', ignoreInitial: false }, copy_font);
	gulp.watch(paths.meta.src, { events: 'all', ignoreInitial: false }, copy_meta);
	gulp.watch(paths.svgsmall.src, { events: 'all', ignoreInitial: false }, svgsmall);
	gulp.watch(paths.svgmedium.src, { events: 'all', ignoreInitial: false }, svgmedium);
	gulp.watch(paths.svgplain.src, { events: 'all', ignoreInitial: false }, svgplain);
	gulp.watch(paths.svgshadow.src, { events: 'all', ignoreInitial: false }, svgshadow);
	gulp.watch(paths.svgwide.src, { events: 'all', ignoreInitial: false }, svgwide);
	gulp.watch(paths.svglogo.src, { events: 'all', ignoreInitial: false }, svglogo);
	gulp.watch(paths.staticsvg.src, { events: 'all', ignoreInitial: false }, copy_svg);
	gulp.watch(paths.scss.src, { events: 'all', ignoreInitial: false }, gulp.series(scss_dev, css_prefix_dev));
	gulp.watch(paths.js.watch, { events: 'all', ignoreInitial: false }, js_dev);
	gulp.watch(paths.html.src, { events: 'all', ignoreInitial: false }, html);
}
function production() {
	return gulp.parallel(
		// image,
		svgmedium,
		svgplain,
		svgshadow,
		svgwide,
		copy_meta,
		copy_font,
		svgsmall,
		copy_svg,
		js_prod,
		gulp.series(
			scss_prod,
			css_prefix_prod
		)
	);
}

gulp.task('dev', gulp.series(development));
gulp.task('dev:webp', gulp.series(image));
gulp.task('prod', gulp.parallel(production(), eleventy_prod));
gulp.task('prod:serve', gulp.series(production(), eleventy_dev));
gulp.task('default', gulp.series('dev'));