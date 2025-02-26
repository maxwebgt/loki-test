module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/app/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['**/?(*.)+(spec|test).js']
};
