var fs = require('fs');
var dir = './src/contracts';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.createReadStream('./build/contracts/FindRequest.json').pipe(fs.createWriteStream('./src/contracts/FindRequest.json'));
fs.createReadStream('./build/contracts/FindRequestFactory.json').pipe(fs.createWriteStream('./src/contracts/FindRequestFactory.json'));