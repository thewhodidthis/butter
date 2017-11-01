import 'cutaway'
import { assert, report } from 'tapeless'
import createFilter from './index.es'

const { ok, equal } = assert

const filter = createFilter()
const { data } = filter()

equal(typeof filter, 'function', 'returns funtion on init', 'will default')
equal(data.length, 4)

const source = new ImageData(1, 1)
const result = filter(source)

ok(result instanceof source.constructor, 'input/output type is a match', 'will operate')
equal(result.data.length, source.data.length, 'input/output size is a match')

report()
