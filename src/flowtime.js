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
  let values = []

  // generate sequence
  for (let i = 0; i < length; i++) {
    values.push(lcg.rand())
  }

  // copy and sort sequence
  let sorted = values.slice().sort()

  // normalize values based on their order
  for (let i = 0; i < sorted.length; i++) {
    values[values.indexOf(sorted[i])] = i
  }

  return values
}

const getHourLcg = (seed) => {
  // values from the Numerical Recipes book
  return createLcg(seed, 4294967296, 1664525, 1013904223)
}

const getMinuteLcg = (seed) => {
  // values from MINSTD
  return createLcg(seed, 2147483647, 48271, 0)
}

export const fromDate = (date) => {
  // extract seeds
  let seed = getSeedsFromDate(date)

  // generate sequences
  let mLcg = getMinuteLcg(seed.minute)
  let mSequence = getSequenceFromLcg(mLcg, 60)
  let hLcg = getHourLcg(seed.hour)
  let hSequence = getSequenceFromLcg(hLcg, 24)

  return {
    hour: hSequence[date.getHours()],
    minute: mSequence[date.getMinutes()],
    second: date.getSeconds()
  }
}
