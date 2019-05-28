'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const mqpacker = require('css-mqpacker');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const webpack = require('webpack-stream');
const named = require('vinyl-named');
const path = require('path');
const gulplog = require('gulplog');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const pug = require('gulp-pug');
const	htmlbeautify = require('gulp-html-beautify');

var isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// PUG COMPILES
gulp.task('pug', function() {
	return gulp.src('./src/*.pug')
		.pipe(plumber())
		.pipe(pug())
		.pipe(gulpIf(isDev, htmlbeautify()))
		.pipe(gulp.dest('build'));
});

// STYLES
gulp.task('styles', function () {
	var plugins = [
		autoprefixer({browsers: ['last 2 version'], cascade: true}),
		mqpacker({sort: true})
	];
	return gulp.src('src/styles/style.styl')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus({
			'include css': true
		}))
		.pipe(postcss(plugins))
		.pipe(gulpIf(!isDev, csso({
			comments: false
		})))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'));
});

// webpack
gulp.task('webpack', () => {
  return gulp.src('src/js/main.js')
    .pipe(webpack({
      mode: 'development',
			entry: './src/js/main.js',
			output: {
				path: path.resolve(__dirname, 'build/js'),
				filename: 'main.js'
			},
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			},
			devtool: 'inline-cheap-module-source-map'
    }))
    .pipe(gulp.dest('build/js/'));
});

// IMAGE MIN
gulp.task('img', function() {
	return gulp.src(['src/img/*.*', '!src/img/svgsprite.svg'])
		.pipe(plumber())
		.pipe(newer('build/img'))
		.pipe(imagemin([
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: false},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest('build/img'));
});

// IMAGES TO WEBP
gulp.task('webpp', () =>
	gulp.src('src/img/*.{jpg,png}')
		.pipe(plumber())
		.pipe(newer('build/img'))
		.pipe(webp({quality: 90}))
		.pipe(gulp.dest('build/img'))
);

//SVG-SPRITE
gulp.task('svgsprite', function() {
	return gulp.src('src/img/icons/*.svg')
		.pipe(plumber())
		.pipe(svgmin({
			plugins: [
				{removeViewBox: false},
				{cleanupIDs: false}
			]
		}))
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename('svgsprite.svg'))
		.pipe(gulp.dest('src/img'));
});

// CLEAN BUILD DIR
gulp.task('clean', function() {
	return del('build');
});

// COPY MISC
gulp.task('misc', function() {
	return gulp.src('src/misc/**/*.*')
		.pipe(newer('build/misc'))
		.pipe(gulp.dest('build/misc'));
});

// BROWSER SYNC
gulp.task('serve', function () {
	browserSync.init({
		server: 'build',
		port: 5050,
		online: false
	});

	browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

// TASKS
gulp.task('watch', function() {
	gulp.watch('src/**/*.pug', gulp.series('pug'));
	gulp.watch('src/**/*.styl', gulp.series('styles'));
	gulp.watch('src/js/**/*.js', gulp.series('webpack'));
	gulp.watch('src/img/*.*', gulp.series('img'));
	gulp.watch('src/img/*.{jpg,png}', gulp.series('webpp'));
	gulp.watch('src/img/icons/*.svg', gulp.series('svgsprite'));
	gulp.watch('src/misc/**/*.*', gulp.series('misc'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'webpack', 'img', 'webpp', 'svgsprite', 'misc'), 'pug'));
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
