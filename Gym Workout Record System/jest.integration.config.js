module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/server/integration-tests/setup.js"], 
  testMatch: ["<rootDir>/server/integration-tests/**/*.test.js"], 
  silent: true,
};
