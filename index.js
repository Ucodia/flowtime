const createLcg = (seed, modulus, multiplier, increment) => {
    const m = modulus
    const a = multiplier
    const c = increment
    let z = seed
  
    return {
      rand: () => {
        z = (a * z + c) % m
        return z / m
      }
    }
  }
  
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

const mergeTimeWithDate = (time, date) => {
  const flowdate = new Date(date.getTime())
  flowdate.setHours(time.hour)
  flowdate.setMinutes(time.minute)
  flowdate.setSeconds(time.second)
  return flowdate
}

export const fromDate = (date) => {
  // extract seeds
  const seed = getSeedsFromDate(date)

  // create hours LCG using values from MINSTD
  const mLcg = createLcg(seed.minute, 2147483647, 48271, 0)
  
  // create hours LCG using values from the Numerical Recipes book
  const hLcg = createLcg(seed.hour, 4294967296, 1664525, 1013904223)

  // generate sequences
  const mSequence = getSequenceFromLcg(mLcg, 60)
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