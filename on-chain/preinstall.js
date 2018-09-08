var fs = require('fs');
fs.createReadStream('./build/contracts/FindRequest.json').pipe(fs.createWriteStream('./src/contracts/FindRequest.json'));
fs.createReadStream('./build/contracts/FindRequestFactory.json').pipe(fs.createWriteStream('./src/contracts/FindRequestFactory.json'));