const fs = require('fs-extra');
const path = require('path');

const cp = async() => {
  const esFiles = await fs.readdir('./');
  const files = esFiles.filter((f) => f.endsWith('.js') && !f.startsWith('.'));

  files.forEach(async(f) => {
    const base = path.basename(f, '.js');
    const content = await fs.readFile(f, 'utf8');
    const updated = content.replace(/( from .*?)\.js/g, '$1.mjs');

    await fs.writeFile(`${base}.mjs`, updated);
  })
}

if (!module.parent) {
  cp();
}
