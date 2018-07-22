import createLcg from './createLcg'

const getSeedsFromDate = (date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date
    .getDate() // day of the month
    .toString()
    .padStart(2, '0')
  const hour = date
    .getHours()
    .toString()
    .padStart(2, '0')

  return {
    minute: parseInt(`${year}${month}${day}${hour}`),
    hour: parseInt(`${year}${month}${day}`)
  }
}

const getSequenceFromLcg = (lcg, length) => {
  const values = []

  // generate sequence
  for (let i = 0; i < length; i++) {
    values.push(lcg.rand())
  }

  // copy and sort sequence
  const sorted = values.slice().sort()

  // normalize values based on their order
  for (let i = 0; i < sorted.length; i++) {
    values[values.indexOf(sorted[i])] = i
  }

  return values
}

const getHourLcg = (seed) =>
  // values from the Numerical Recipes book
  createLcg(seed, 4294967296, 1664525, 1013904223)

const getMinuteLcg = (seed) =>
  // values from MINSTD
  createLcg(seed, 2147483647, 48271, 0)

const mergeTimeWithDate = (time, date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hour,
    time.minute,
    time.second
  )

export const fromDate = (date) => {
  // extract seeds
  const seed = getSeedsFromDate(date)

  // generate sequences
  const mLcg = getMinuteLcg(seed.minute)
  const mSequence = getSequenceFromLcg(mLcg, 60)
  const hLcg = getHourLcg(seed.hour)
  const hSequence = getSequenceFromLcg(hLcg, 24)

  // build flowtime
  const time = {
    hour: hSequence[date.getHours()],
    minute: mSequence[date.getMinutes()],
    second: date.getSeconds()
  }

  return {
    ...time,
    toDate: () => mergeTimeWithDate(time, date)
  }
}
