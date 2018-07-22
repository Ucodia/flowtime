import { fromDate } from '../src/flowtime'

describe('flowtime > fromDate', () => {
  it('should return valid time values', () => {
    const actual = fromDate(new Date())

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

  it('should map to known flowtime values', () => {
    const actuals = [
      new Date('1901-10-18T06:12:37'),
      new Date('2069-04-20T04:20:00'),
      new Date('1975-05-01T12:54:09'),
      new Date('1988-09-30T10:59:46'),
      new Date('2052-01-01T18:37:19')
    ].map(fromDate)

    const expected = [
      { hour: 5, minute: 3, second: 37 },
      { hour: 5, minute: 57, second: 0 },
      { hour: 13, minute: 31, second: 9 },
      { hour: 21, minute: 56, second: 46 },
      { hour: 9, minute: 51, second: 19 }
    ]

    expect(actuals).toMatchObject(expected)
  })

  it('should return every hour and minute combinations of flowtime only once per day', () => {
    const actuals = []
    const expected = []

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const hh = h.toString().padStart(2, '0')
        const mm = m.toString().padStart(2, '0')
        actuals.push(fromDate(new Date(`2000-01-01T${hh}:${mm}:00`)))
        expected.push({ hour: h, minute: m, second: 0 })
      }
    }

    const actualsSort = actuals.sort(
      (a, b) => a.hour - b.hour || a.minute - b.minute || a.second - b.second
    )

    expect(actualsSort).toMatchObject(expected)
  })
})

describe('flowtime > fromDate > toDate', () => {
  it('should convert flowtime to date object', () => {
    const now = new Date()
    const flowtime = fromDate(now)
    const flowdate = flowtime.toDate()

    expect(flowdate.getFullYear()).toEqual(now.getFullYear())
    expect(flowdate.getMonth()).toEqual(now.getMonth())
    expect(flowdate.getDate()).toEqual(now.getDate())
    expect(flowdate.getHours()).toEqual(flowtime.hour)
    expect(flowdate.getMinutes()).toEqual(flowtime.minute)
    expect(flowdate.getSeconds()).toEqual(flowtime.second)
  })
})
