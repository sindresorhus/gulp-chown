import process from 'node:process';
import {Buffer} from 'node:buffer';
import test from 'ava';
import Vinyl from 'vinyl';
import {pEvent} from 'p-event';
import chown from './index.js';

test('chown files', async t => {
	const stream = chown(501, 20);

	stream.end(new Vinyl({
		stat: {
			uid: 400,
			gid: 10,
		},
		contents: Buffer.from(''),
	}));

	const file = await pEvent(stream, 'data');
	t.is(file.stat.uid, 501);
	t.is(file.stat.gid, 20);
});

test.failing('chown is applied to file on disk when using gulp.dest() (gh-5)', async t => {
	const {default: gulp} = await import('gulp');
	const {mkdtemp, stat, writeFile, rm} = await import('node:fs/promises');
	const {tmpdir} = await import('node:os');
	const {join} = await import('node:path');

	const sourceDirectory = await mkdtemp(join(tmpdir(), 'gulp-chown-src-'));
	const destinationDirectory = await mkdtemp(join(tmpdir(), 'gulp-chown-dest-'));
	const sourceFile = join(sourceDirectory, 'test.txt');
	await writeFile(sourceFile, 'hello');

	const targetUid = 99;
	const targetGid = 99;

	await new Promise((resolve, reject) => {
		gulp.src(sourceFile)
			.pipe(chown(targetUid, targetGid))
			.pipe(gulp.dest(destinationDirectory))
			.on('end', resolve)
			.on('error', reject);
	});

	const destinationFile = join(destinationDirectory, 'test.txt');
	const destinationStat = await stat(destinationFile);
	t.is(destinationStat.uid, targetUid);
	t.is(destinationStat.gid, targetGid);

	await rm(sourceDirectory, {recursive: true});
	await rm(destinationDirectory, {recursive: true});
});

if (!('CI' in process.env)) {
	test.failing('chown files using a username', async t => {
		const username = 'root';
		const expectedUid = 0;
		const expectedGid = 0;

		const stream = chown(username);
		stream.end(new Vinyl({
			stat: {
				uid: 400,
				gid: 10,
			},
			contents: Buffer.from(''),
		}));

		const file = await pEvent(stream, 'data');
		t.is(file.stat.uid, expectedUid);
		t.is(file.stat.gid, expectedGid);
	});
}
