import path from 'path';
import fs from 'fs';

import {isCliCall, readFile, through2} from './esm.mjs';

const projRoot = process.cwd();
const readmeMd = path.join(projRoot, 'README.md');

export const cleanMarkdown = (file, onFinish) => {
  return new Promise((resolve, reject) => {
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
    .pipe(fs.createWriteStream(readmeMd)
    .on('finish', () => {
      return readFile(readmeMd, 'utf8')
      .then(resolve);
    }));
  });
};

if (isCliCall(import.meta)) {
  cleanMarkdown();
}
