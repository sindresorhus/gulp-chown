'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var uidNumber = require('uid-number');
var defaultMode = 511 & (~process.umask()); // 511 = 0777
var cachedUid;
var cachedGid;

module.exports = function (user, group) {
	var firstFile = true;
	var finalUid = typeof cachedUid === 'number' ? cachedUid : typeof user === 'number' ? user : null;
	var finalGid = typeof cachedGid === 'number' ? cachedGid : typeof group === 'number' ? group : null;

	return through.obj(function (file, enc, cb) {
		if (file.isNull() && ! file.isDirectory()) {
			cb(null, file);
			return;
		}

		file.stat = file.stat || {};
		file.stat.mode = file.stat.mode || defaultMode;

		function finish() {
			file.stat.uid = finalUid != null ? finalUid : file.stat.uid;
			file.stat.gid = finalGid != null ? finalGid : file.stat.gid;
			cb(null, file);
		}

		if (firstFile && typeof user === 'string' && finalUid === null && finalGid === null) {
			uidNumber(user, group, function (err, uid, gid) {
				if (err) {
					cb(new gutil.PluginError('gulp-chown', err, {fileName: file.path}));
					return;
				}

				cachedUid = finalUid = uid;
				cachedGid = finalGid = gid;

				finish();
			});

			firstFile = false;
			return;
		}

		finish();
	});
};
