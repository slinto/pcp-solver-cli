import test from 'ava';
import execa from 'execa';

global.Promise = Promise;

test('', t => {
	t.notThrows(execa('./cli.js', ['010/0 00/100 11/01']));
});
