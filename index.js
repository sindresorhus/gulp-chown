'use strict';
const through = require('through2');
const uidNumber = require('uid-number');
const PluginError = require('plugin-error');

const defaultMode = 511 & (~process.umask()); // 511 = 0777
const uidCache = {};
const gidCache = {};

module.exports = (user, group) => {
	let firstFile = true;
	let finalUid = typeof uidCache[user] === 'number' ? uidCache[user] : (typeof user === 'number' ? user : null);
	let finalGid = typeof gidCache[group] === 'number' ? gidCache[group] : (typeof group === 'number' ? group : null);

	return through.obj((file, encoding, callback) => {
		if (file.isNull() && !file.isDirectory()) {
			callback(null, file);
			return;
		}

		file.stat = file.stat || {};
		file.stat.mode = file.stat.mode || defaultMode;

		function finish() {
			file.stat.uid = finalUid === null ? file.stat.uid : finalUid;
			file.stat.gid = finalGid === null ? file.stat.gid : finalGid;
			callback(null, file);
		}

		if (firstFile && typeof user === 'string' && finalUid === null && finalGid === null) {
			uidNumber(user, group, (error, uid, gid) => {
				if (error) {
					callback(new PluginError('gulp-chown', error, {fileName: file.path}));
					return;
				}

				finalUid = uid;
				uidCache[user] = finalUid;

				finalGid = gid;
				gidCache[group] = finalGid;

				finish();
			});

			firstFile = false;
			return;
		}

		finish();
	});
};
