const kpow = require('kpow')
const test = require('tape')
const createFilter = require('./')

kpow()

test('will default', (t) => {
  const filter = createFilter()
  const result = filter()

  t.equal(typeof filter, 'function', 'returns funtion on init')
  t.equal(result.data.length, 4)
  t.end()
})

test('will operate', (t) => {
  const source = new ImageData(1, 1)

  const filter = createFilter()
  const result = filter(source)

  t.ok(result instanceof source.constructor, 'input/output type is a match')
  t.equal(result.data.length, source.data.length, 'input/output size is a match')
  t.end()
})
