module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/server/tests/setup.js"], 
  testMatch: ["<rootDir>/server/tests/**/*.test.js"], 
  silent: false, 
};
