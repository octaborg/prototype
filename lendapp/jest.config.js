/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(t)s$': 'ts-jest',
    '^.+\\.(j)s$': 'babel-jest',
  },
  resolver: '<rootDir>/resolver.cjs',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!snarkyjs/node_modules/tslib|date-fns)',
  ],
};
