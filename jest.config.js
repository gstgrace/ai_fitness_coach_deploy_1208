const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/constants$': '<rootDir>/__mocks__/constants.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};