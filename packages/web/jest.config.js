module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(preact|@fullcalendar)/)'
  ]
};
