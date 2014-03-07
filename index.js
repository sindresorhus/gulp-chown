'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var uidNumber = require('uid-number');

module.exports = function (user, group) {
	var firstFile = true;
	var finalUid = typeof user === 'number' ? user : null;
	var finalGid = typeof group === 'number' ? group : null;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-chmod', 'Streaming not supported'));
			return cb();
		}

		var finish = function () {
			file.stat.uid = finalUid != null ? finalUid : file.stat.uid;
			file.stat.gid = finalGid != null ? finalGid : file.stat.gid;
			this.push(file);
			cb();
		}.bind(this);

		if (firstFile && typeof user === 'string') {
			uidNumber(user, group, function (err, uid, gid) {
				if (err) {
					this.emit('error', new gutil.PluginError('gulp-chmod', err));
					return cb();
				}

				finalUid = uid;
				finalGid = gid;

				finish();
			}.bind(this));

			firstFile = false;
			return;
		}

		finish();
	});
};
