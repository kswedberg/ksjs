import path from 'path';
import process from 'process';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const require = createRequire(import.meta.url);
const commonJsFs = require('fs-extra');

export const {readFile, outputFile, readJson, readdir}  = commonJsFs;
export const Markdown = require('markdown-it');
export const jsdoc2md = require('jsdoc-to-markdown');
export const through2 = require('through2');
export const chokidar = require('chokidar');

export const isCliCall = (meta) => {
  const argv1 = process.argv && process.argv[1];

  if (!meta || !argv1) {
    return false;
  }
  const require = createRequire(meta.url);
  const argvPath = require.resolve(argv1);
  const argvExt = path.extname(argvPath);

  const metaPath = fileURLToPath(meta.url);
  const metaExt = path.extname(metaPath);

  if (argvExt) {
    return argvPath === metaPath;
  }

  return argvPath === metaPath.slice(0, -metaExt.length);
};
