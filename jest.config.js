module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text-summary', 'text'],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true
};
