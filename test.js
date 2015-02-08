'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var chown = require('./');

it('should chown files', function (cb) {
	var stream = chown(501, 20);

	stream.on('data', function (file) {
		assert.strictEqual(file.stat.uid, 501);
		assert.strictEqual(file.stat.gid, 20);
		cb();
	});

	stream.write(new gutil.File({
		stat: {
			uid: 400,
			gid: 10
		},
		contents: new Buffer('')
	}));
});

it('should chown files using a username', function (cb) {
	var stream = chown(process.env.TRAVIS ? 'travis' : 'root');

	stream.on('data', function (file) {
		assert.strictEqual(file.stat.uid, process.env.TRAVIS ? 1000 : 0);
		assert.strictEqual(file.stat.gid, process.env.TRAVIS ? 1000 : 0);
		cb();
	});

	stream.write(new gutil.File({
		stat: {
			uid: 400,
			gid: 10
		},
		contents: new Buffer('')
	}));
});
