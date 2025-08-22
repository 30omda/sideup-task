module.exports = {
    setItem: jest.fn((key, value) => {
        return true;
    }),
    getItem: jest.fn((key) => null)
};
