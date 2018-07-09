export default (seed, modulus, multiplier, increment) => {
  const m = modulus
  const a = multiplier
  const c = increment
  const s = seed
  let z = seed

  return {
    rand: () => {
      z = (a * z + c) % m
      return z / m
    }
  }
}
