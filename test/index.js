const test = require('tape');
const filter = require('../');

test('will return', (t) => {
  t.equal(typeof filter, 'function', 'returns funtion on init');
  t.end();
});

