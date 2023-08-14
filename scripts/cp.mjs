import {isCliCall, readdir, readFile, outputFile, remove} from './esm.mjs';
import {cjsFileNames} from '../rollup.config.mjs';
import path from 'path';
import chalk from 'chalk';

const isCli = isCliCall(import.meta);

const copyFiles = (files, {dir = '.', ext}) => {
  if (isCli) {
    console.log(chalk.cyan(`Copying scripts to *.${ext}...`));
  }
  files.forEach(async(f) => {
    const base = path.basename(f, '.js');
    const inputFile = path.resolve(dir, f);
    const content = await readFile(inputFile, 'utf8');
    const transformed = content
    // .replace(/(import.+)(\.js)/g, '$1.mjs')
    // .replace(/(import.+)(\.js)/g, '$1.cjs')
    .replace(/@bamf-health\/bamfjs/g, 'ksjs');

    await outputFile(`${base}.${ext}`, transformed);
  });
};

const deleteFiles = (files, options = {}) => {
  const {dir = '.'} = options;

  if (isCli) {
    console.log(chalk.cyan('Deleting scripts...'));
  }
  files.forEach(async(f) => {
    const inputFile = path.resolve(dir, f);

    await remove(inputFile);
  });
};

const cp = async() => {
  const topFiles = await readdir('./');
  const allCjsFiles = await readdir('./cjs/');
  const esFiles = topFiles.filter((f) => f.endsWith('.js') && !f.startsWith('.'));

  const cjsFiles = allCjsFiles.filter((f) => cjsFileNames.includes(f) || f === 'index.js');
  const cjsToDelete = allCjsFiles.filter((f) => !cjsFileNames.includes(f) && f !== 'index.js');

  await deleteFiles(cjsToDelete, {dir: './cjs/'});
  copyFiles(esFiles, {ext: 'mjs'});
  copyFiles(cjsFiles, {ext: 'cjs', dir: './cjs/'});
};

const cpSrc = async() => {
  const srcFiles = await readdir('./src/');

  // srcFiles.forEach(async(f) => {
  //   const inputFile = path.resolve('./src/', f);
  //   const content = await readFile(inputFile, 'utf8');
  //   const transformed = content
  //   .replace(/@bamf-health\/bamfjs/g, 'ksjs');

  //   await outputFile(inputFile, transformed);

  // });
};

if (isCli) {
  console.log('');
  cpSrc()
  .then(() => {
    cp()
    .then(() => {
      console.log(chalk.green('Finished copying all scripts!'));
    });
  });
  cp()
  .then(() => {
    console.log(chalk.green('Finished copying all scripts!'));
  });
} else {
  console.log('This is not a CLI call.');
}
