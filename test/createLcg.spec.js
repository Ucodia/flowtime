import createLcg from '../src/createLcg'

const createNumericalRecipeLcg = (seed) => {
  return createLcg(seed, 4294967296, 1664525, 1013904223)
}

test('returns random number between 0 and 1', () => {
  const gen = createNumericalRecipeLcg(87654321)

  for (let i = 0; i < 100; i++) {
    const actual = gen.rand()
    expect(actual).toBeGreaterThan(0)
    expect(actual).toBeLessThan(1)
  }
})

test('returns known sequence for seed and parameters', () => {
  const gen = createNumericalRecipeLcg(12345678)

  const expected = [
    0.833541413070634,
    0.7566593699157238,
    0.6737769430037588,
    0.8021213044412434,
    0.2003430335316807,
    0.2239572936668992,
    0.7503088682424277,
    0.10497919982299209,
    0.738653338747099,
    0.18474598787724972
  ]

  expected.forEach((n) => {
    const actual = gen.rand()
    expect(actual).toBe(n)
  })
})
