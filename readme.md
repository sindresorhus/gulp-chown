# [gulp](http://gulpjs.com)-chown [![Build Status](https://travis-ci.org/sindresorhus/gulp-chown.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-chown)

> Change permissions of [Vinyl](https://github.com/wearefractal/vinyl) files


## Install

```bash
$ npm install --save-dev gulp-chown
```


## Usage

```js
var gulp = require('gulp');
var chown = require('gulp-chown');

gulp.task('default', function () {
	return gulp.src('src/app.js')
		.pipe(chown('sindresorhus'))
		.pipe(gulp.dest('dist'));
});
```

or

```js
var gulp = require('gulp');
var chown = require('gulp-chown');

gulp.task('default', function () {
	gulp.src('src/app.js')
		.pipe(chown(501))
		.pipe(gulp.dest('dist'));
});
```


## API

### chown(userId, groupId)

Arguments must be of the same type.

#### userId

*Required*  
Type: `String`, `Number`

The user name or [user id](https://en.wikipedia.org/wiki/User_identifier) to change ownership to.

#### userId

Type: `String`, `Number`

The group name or [group id](https://en.wikipedia.org/wiki/Group_identifier) to change ownership to.


## Tip

Combine it with [gulp-filter](https://github.com/sindresorhus/gulp-filter) to only change ownership of a subset of the files.

```js
var gulp = require('gulp');
var gFilter = require('gulp-filter');
var chown = require('gulp-chown');

var filter = gFilter('src/vendor-*.js');

gulp.task('default', function () {
	gulp.src('src/*.js')
		// filter a subset of the files
		.pipe(filter)
		// change ownership of them
		.pipe(chown('sindresorhus'))
		// bring back the previously filtered out files
		.pipe(filter.restore())
		.pipe(gulp.dest('dist'));
});
```


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
