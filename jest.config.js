module.exports = {
    // globalSetup: "<rootDir>/jest.setup.js", // this line is the only change here
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^~/(.*)$": "<rootDir>/$1",
        "^vue$": "vue/dist/vue.common.js"
    },
    moduleFileExtensions: ["js", "vue", "json"],
    // testEnvironment: "jsdom",
    // transform: {
    //     "^.+\\.js$": "babel-jest",
    //     ".*\\.(vue)$": "vue-jest"
    // },
    transform: {
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
        ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    },
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/**/*.(vue|js)"],
    forceExit: !!process.env.CI // almost every CI platform sets this by default
}