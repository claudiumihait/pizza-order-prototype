var fs = require('fs');

function writeFile(filename, data) {
    data = JSON.stringify(data);
    fs.writeFileSync(filename, data)
};

module.exports = writeFile;