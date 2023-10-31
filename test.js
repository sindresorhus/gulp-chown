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

test.failing('chown files using a username', async t => {
	if ('CI' in process.env) {
		t.pass();
		return;
	}

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
