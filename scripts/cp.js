const fs = require('fs-extra');
const path = require('path');

const cp = async() => {
  const esFiles = await fs.readdir('./');
  const files = esFiles.filter((f) => f.endsWith('.js') && !f.startsWith('.'));

  files.forEach(async(f) => {
    const base = path.basename(f, '.js');
    await fs.copy(f, `${base}.mjs`);
  })
}

if (!module.parent) {
  cp();
}
