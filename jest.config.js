   // jest.config.js
   module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
  };