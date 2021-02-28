const fs = require('fs');
const path = require('path');


exports.getFileContents = (filePath) => {
    let fileContents = JSON.parse(fs.readFileSync(path.join(__dirname, filePath)));
    return fileContents;
}

// exports.writeFileContents = (filePath, fileContents, data) => {
//     fileContents.push(data);
//     fileContents = JSON.stringify(fileContents);
//     fs.writeFileSync(path.join(__dirname, filePath), fileContents);
// }