const { nameNormalizator } = require('../normalize.user');

const expectedNames = [
  {
    input: 'Peter griffin',
    output: 'Peter Griffin'
  },
  {
    input: 'PetEr griffin',
    output: 'Peter Griffin'
  },
  {
    input: 'peter griffin',
    output: 'Peter Griffin'
  },
  {
    input: 'Péter Griffin',
    output: 'Peter Griffin'
  },
  {
    input: 'Peter   griffin',
    output: 'Peter Griffin'
  },
  {
    input: 'Peter (#*44 griffin',
    output: 'Peter Griffin'
  },
  {
    input: null,
    output: ''
  },
  {
    input: undefined,
    output: ''
  },
  {
    input: '+380666666666',
    output: ''
  },
  {
    input: 'email@gmail.com', // still doesn't work
    output: 'Email Gmail Com'
  },
];

describe('nameNormalizator test', () => {
  test('every item test', () => {
    expectedNames.forEach((item) => {
      expect(nameNormalizator(item.input)).toBe(item.output);
    });
  });
});
