/* eslint-env mocha */
'use strict';
const assert = require('assert');
const Vinyl = require('vinyl');
const chown = require('.');

it('chown files', cb => {
	const stream = chown(501, 20);

	stream.on('data', file => {
		assert.strictEqual(file.stat.uid, 501);
		assert.strictEqual(file.stat.gid, 20);
		cb();
	});

	stream.end(new Vinyl({
		stat: {
			uid: 400,
			gid: 10
		},
		contents: Buffer.from('')
	}));
});

it('chown files using a username', cb => {
	const stream = chown(process.env.TRAVIS ? 'travis' : 'root');

	stream.on('data', file => {
		assert.strictEqual(file.stat.uid, process.env.TRAVIS ? 2000 : 0);
		assert.strictEqual(file.stat.gid, process.env.TRAVIS ? 2000 : 0);
		cb();
	});

	stream.end(new Vinyl({
		stat: {
			uid: 400,
			gid: 10
		},
		contents: Buffer.from('')
	}));
});
