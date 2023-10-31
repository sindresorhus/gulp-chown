import process from 'node:process';
import uidNumber_ from 'uid-number';
import {gulpPlugin} from 'gulp-plugin-extras';
import pify from 'pify';

const uidNumber = pify(uidNumber_, {multiArgs: true});

const defaultMode = 0o777 & (~process.umask()); // eslint-disable-line no-bitwise
const uidCache = {};
const gidCache = {};

export default function gulpChown(user, group) {
	let isFirstFile = true;
	let finalUid = typeof uidCache[user] === 'number' ? uidCache[user] : (typeof user === 'number' ? user : undefined);
	let finalGid = typeof gidCache[group] === 'number' ? gidCache[group] : (typeof group === 'number' ? group : undefined);

	return gulpPlugin('gulp-chown', async file => {
		file.stat = file.stat ?? {};
		file.stat.mode = file.stat.mode ?? defaultMode;

		if (isFirstFile && typeof user === 'string' && finalUid === undefined && finalGid === undefined) {
			let result;
			try {
				result = await uidNumber(user, group);
			} catch (error) {
				throw error[0];
			}

			finalUid = result.uid;
			uidCache[user] = finalUid;

			finalGid = result.gid;
			gidCache[group] = finalGid;

			isFirstFile = false;
		}

		file.stat.uid = finalUid ?? file.stat.uid;
		file.stat.gid = finalGid ?? file.stat.gid;

		return file;
	}, {supportsDirectories: true});
}
