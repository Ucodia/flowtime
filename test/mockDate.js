export default (year, month, day, hour, minute, second) => {
  const getFullYear = jest.fn()
  getFullYear.mockReturnValue(year)

  const getMonth = jest.fn()
  getMonth.mockReturnValue(month - 1) // getMonth() is 0 indexed

  const getDate = jest.fn()
  getDate.mockReturnValue(day)

  const getHours = jest.fn()
  getHours.mockReturnValue(hour)

  const getMinutes = jest.fn()
  getMinutes.mockReturnValue(minute)

  const getSeconds = jest.fn()
  getSeconds.mockReturnValue(second)

  return {
    getFullYear,
    getMonth,
    getDate,
    getHours,
    getMinutes,
    getSeconds
  }
}
