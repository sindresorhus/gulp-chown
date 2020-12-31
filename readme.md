# gulp-chown

> [Change owner](https://en.wikipedia.org/wiki/Chown) of [Vinyl](https://github.com/gulpjs/vinyl) files


## Install

```
$ npm install --save-dev gulp-chown
```


## Usage

```js
const gulp = require('gulp');
const chown = require('gulp-chown');

exports.default = () => (
	gulp.src('src/app.js')
		.pipe(chown('sindresorhus'))
		.pipe(gulp.dest('dist'))
);
```

or

```js
const gulp = require('gulp');
const chown = require('gulp-chown');

exports.default = () => (
	gulp.src('src/app.js')
		.pipe(chown(501))
		.pipe(gulp.dest('dist'))
);
```


## API

### chown(userId, groupId)

Arguments must be of the same type.

#### userId

*Required*
Type: `string | number`

The user name or [user id](https://en.wikipedia.org/wiki/User_identifier) to change ownership to.

#### groupId

Type: `string | number`

The group name or [group id](https://en.wikipedia.org/wiki/Group_identifier) to change ownership to.


## Tip

Combine it with [gulp-filter](https://github.com/sindresorhus/gulp-filter) to only change ownership of a subset of the files.

```js
const gulp = require('gulp');
const gFilter = require('gulp-filter');
const chown = require('gulp-chown');

const filter = gFilter('src/vendor-*.js');

exports.default = () => (
	gulp.src('src/*.js')
		// Filter a subset of the files
		.pipe(filter)
		// Change ownership of them
		.pipe(chown('sindresorhus'))
		// Bring back the previously filtered out files
		.pipe(filter.restore())
		.pipe(gulp.dest('dist'))
);
```


## Related

- [gulp-chmod](https://github.com/sindresorhus/gulp-chmod) - Change permissions of Vinyl files
