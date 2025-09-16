module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/test-file-stub.js",
  },
  testMatch: [
    "<rootDir>/src/**/*.test.[jt]s?(x)",
    "<rootDir>/src/**/__tests__/**/*.[jt]s?(x)",
  ],
};
