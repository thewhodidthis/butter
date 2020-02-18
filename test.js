'use strict'

const { equal } = require('tapeless')
const createFilter = require('./')

const filter = createFilter()
const { data } = filter()

equal
  .describe('returns lambda on init', 'will default')
  .test(typeof filter, 'function')
  .describe('data empty')
  .test(data.length, 0)

const source = { data: [1, 2, 3, 4] }
const result = filter(source)

equal
  .describe('input/output size is a match', 'will operate')
  .test(result.data.length, source.data.length)
