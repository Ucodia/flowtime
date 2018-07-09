import { fromDate } from '../src/flowtime'
import mockDate from './mockDate'

test('returns valid time values', () => {
  const actual = fromDate(mockDate(2018, 4, 20, 4, 20, 0))

  expect(typeof actual.hour).toBe('number')
  expect(actual.hour).toBeGreaterThanOrEqual(0)
  expect(actual.hour).toBeLessThanOrEqual(23)

  expect(typeof actual.minute).toBe('number')
  expect(actual.minute).toBeGreaterThanOrEqual(0)
  expect(actual.minute).toBeLessThanOrEqual(60)

  expect(typeof actual.second).toBe('number')
  expect(actual.second).toBeGreaterThanOrEqual(0)
  expect(actual.second).toBeLessThanOrEqual(60)
})

test('returns known flow time values', () => {
  const actuals = [
    mockDate(1901, 10, 18, 6, 12, 37),
    mockDate(2069, 4, 20, 4, 20, 0),
    mockDate(1975, 5, 1, 12, 54, 9),
    mockDate(1988, 9, 30, 10, 59, 46),
    mockDate(2052, 1, 1, 18, 37, 19)
  ].map((d) => fromDate(d))

  const expected = [
    { hour: 5, minute: 3, second: 37 },
    { hour: 5, minute: 57, second: 0 },
    { hour: 13, minute: 31, second: 9 },
    { hour: 21, minute: 56, second: 46 },
    { hour: 9, minute: 51, second: 19 }
  ]

  expect(actuals).toEqual(expected)
})

test('every hour/minute combinations appears only once per day', () => {
  var actuals = []
  var expected = []

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      actuals.push(fromDate(mockDate(2000, 1, 1, h, m, 0)))
      expected.push({ hour: h, minute: m, second: 0 })
    }
  }

  const actualsSort = actuals.sort(
    (a, b) => a.hour - b.hour || a.minute - b.minute || a.second - b.second
  )

  expect(actuals).toEqual(expected)
})
