module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ["js", "json", "node"],
};