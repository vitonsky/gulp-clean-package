const gulp = require('gulp');
const mergeStream = require('merge-stream');
const clean = require('gulp-clean');
const replace = require('gulp-replace');

const cleanPackageJson = require('./src/cleanPackagePlugin');

const buildDir = 'dist';
const gitPublicMainPath = 'https://github.com/vitonsky/gulp-clean-package/tree/master';

function cleanDist() {
	return gulp.src(buildDir, { allowEmpty: true, read: false }).pipe(clean());
}

function copyMetaFiles() {
	return mergeStream(
		// Clean package.json
		gulp.src(['package.json']).pipe(cleanPackageJson()),
		// Replace relative links to github links
		gulp
			.src(['README.md', 'LICENSE'])
			.pipe(replace(/\.\/docs/g, gitPublicMainPath + '/')),
	).pipe(gulp.dest(buildDir));
}

function buildCjs() {
	return gulp.src(['src/*.js']).pipe(gulp.dest(buildDir));
}

module.exports.default = gulp.series([cleanDist, copyMetaFiles, buildCjs]);
module.exports.clean = cleanDist;
