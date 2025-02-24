/**
 * generates a random sequence of numbers from a seed using a xorshift32
 * random number generator and fisher-yates algorithm to shuffle them
 */
function randomSequence(n, seed) {
  let result = new Array(n);
  let state = seed >>> 0;
  for (let i = 0; i < n; i++) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = Math.floor(((state >>> 0) / 4294967296) * (i + 1));
    result[i] = result[j];
    result[j] = i;
  }
  return result;
}

/**
 * generates flow time from a date
 * @param {Date} date - date to generate flow time from
 * @returns {Object} flow time object with hour, minute, second, and date
 */
export function fromDate(date) {
  // generate seeds from date
  const hoursSeed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const minutesSeed = hoursSeed * 100 + date.getHours();

  // generate flow time sequences from seeds
  const hoursSequence = randomSequence(24, hoursSeed);
  const minutesSequence = randomSequence(60, minutesSeed);

  // map flow time from current time
  const hour = hoursSequence[date.getHours()];
  const minute = minutesSequence[date.getMinutes()];
  const second = date.getSeconds();
  const flowdate = new Date(date.getTime());
  flowdate.setHours(hour, minute);

  return {
    hour,
    minute,
    second,
    date: flowdate,
  };
}

export default {
  fromDate,
};
