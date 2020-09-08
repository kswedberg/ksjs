const path = require('path');
const through2 = require('through2');
const fs = require('fs-extra');
const projRoot = path.join(__dirname, '../');

const cleanMarkdown = (file, completeMsg) => {
  const rDollar = /\[\$/g;
  const inputFile = file || path.join(projRoot, 'scripts/README.md');

  fs.createReadStream(inputFile)
  .pipe(through2(function(buff, enc, callback) {
    let chunk = buff.toString();

    if (rDollar.test(chunk)) {
      chunk = chunk.replace(rDollar, '[\\$');
    }
    if (chunk.includes('**Properties**')) {
      chunk = chunk.replace('**Properties**', '**Methods**');
    }
    chunk = chunk.replace(/&quot;(location.href)&quot;/g, '$1');
    this.push(chunk);

    callback();
  }))
  .pipe(fs.createWriteStream(path.join(projRoot, 'README.md'))
  .on('finish', () => {
    console.log(completeMsg || 'Finished cleaning README.md!');
  }));
};

// @ts-ignore
if (!module.parent) {
  cleanMarkdown();
}

module.exports = {cleanMarkdown};
