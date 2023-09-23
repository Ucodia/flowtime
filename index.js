const createLcg = (seed, modulus, multiplier, increment) => {
  let z = seed;
  return () => {
    z = (multiplier * z + increment) % modulus;
    return z / modulus;
  };
};

const getSeedsFromDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");

  return {
    minute: parseInt(`${year}${month}${day}${hour}`),
    hour: parseInt(`${year}${month}${day}`),
  };
};

const getSequenceFromLcg = (lcg, length) => {
  // generate number sequence
  // [0.4, 0.2, 0.3]
  const sequence = Array.from({ length }, lcg);
  // copy and sort sequence
  // [0.2, 0.3, 0.4]
  const sorted = [...sequence].sort();
  // map sequence elements to their sorting index
  // [2, 0, 1]
  return sequence.map((value) => sorted.indexOf(value));
};

export const fromDate = (date) => {
  // extract seeds
  const seed = getSeedsFromDate(date);

  // create hours LCG using values from MINSTD
  const minuteLcg = createLcg(seed.minute, 2147483647, 48271, 0);

  // create hours LCG using values from the Numerical Recipes book
  const hourLcg = createLcg(seed.hour, 4294967296, 1664525, 1013904223);

  // generate sequences
  const minuteSequence = getSequenceFromLcg(minuteLcg, 60);
  const hourSequence = getSequenceFromLcg(hourLcg, 24);

  const time = {
    hour: hourSequence[date.getHours()],
    minute: minuteSequence[date.getMinutes()],
    second: date.getSeconds(),
  };

  return {
    ...time,
    toDate: () => {
      const flowdate = new Date(date.getTime());
      flowdate.setHours(time.hour);
      flowdate.setMinutes(time.minute);
      flowdate.setSeconds(time.second);
      return flowdate;
    },
  };
};
