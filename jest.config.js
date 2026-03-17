module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'utils/**/*.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text-summary', 'text', 'html'],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true
};
