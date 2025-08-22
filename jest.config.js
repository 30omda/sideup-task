export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: [
        './src/__tests__/setup.js'
    ],
    transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
    },
    transformIgnorePatterns: [
        '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$',
        '^.+\\.module\\.(css|sass|scss)$'
    ],
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    testEnvironmentOptions: {
        url: 'http://localhost'
    }
};
