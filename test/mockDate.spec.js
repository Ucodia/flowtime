import mockDate from './mockDate'

test('mocks all properties for every consecutive calls', () => {
  const year = 1980,
    month = 7,
    day = 13,
    hour = 20,
    minute = 35,
    second = 42

  const target = mockDate(year, month, day, hour, minute, second)

  for (let i = 0; i < 10; i++) {
    expect(target.getFullYear()).toBe(year)
    expect(target.getMonth()).toBe(month - 1)
    expect(target.getDate()).toBe(day)
    expect(target.getHours()).toBe(hour)
    expect(target.getMinutes()).toBe(minute)
    expect(target.getSeconds()).toBe(second)
  }
})
