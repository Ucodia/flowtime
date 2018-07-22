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
  const expectSameDate = (actual, expected) => {
    expect(actual.getFullYear()).toEqual(expected.getFullYear())
    expect(actual.getMonth()).toEqual(expected.getMonth())
    expect(actual.getDate()).toEqual(expected.getDate())
  }

  const expectSameTime = (actual, expected) => {
    expect(actual.getHours()).toEqual(expected.hour)
    expect(actual.getMinutes()).toEqual(expected.minute)
    expect(actual.getSeconds()).toEqual(expected.second)
  }

  it('should convert flowtime to date object', () => {
    const now = new Date()
    const flowtime = fromDate(now)
    const flowdate = flowtime.toDate()

    expectSameDate(flowdate, now)
    expectSameTime(flowdate, flowtime)
  })

  // see issue https://gitlab.com/ucodia/flowtime/issues/1
  it('should convert flowtime from years 0 to 99 as expected', () => {
    for (let i = 0; i < 100; i++) {
      const yearXX = i.toString().padStart(2, '0')
      const earlyDate = new Date(`00${yearXX}-01-01T00:00:00`)
      const flowtime = fromDate(earlyDate)
      const flowdate = flowtime.toDate()

      expectSameDate(flowdate, earlyDate)
      expectSameTime(flowdate, flowtime)
    }
  })
})
