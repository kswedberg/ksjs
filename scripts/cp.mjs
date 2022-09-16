import {readdir, readFile, outputFile} from './esm.mjs';

import path from 'path';

const cp = async() => {
  const esFiles = await readdir('./');
  const files = esFiles.filter((f) => f.endsWith('.js') && !f.startsWith('.'));

  files.forEach(async(f) => {
    const base = path.basename(f, '.js');
    const content = await readFile(f, 'utf8');
    const updated = content.replace(/( from .*?)\.js/g, '$1.mjs');

    await outputFile(`${base}.mjs`, updated);
  });
};
