const path = require('path');
const resolve = (to) => {
    return path.resolve(__dirname, '..', to);
};

module.exports = {
    path,
    resolve
};
