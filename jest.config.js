module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true
};
