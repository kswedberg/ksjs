import * as dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import path from 'path';
import {readFile} from './esm.mjs';
import chalk from 'chalk';

const rootDir = process.cwd();
const port = process.env.PORT || 3303;
const testDir = path.join(rootDir, 'test');

const sendFileContent = async function(res, fileName, contentType) {
  try {
    const file = path.join(rootDir, fileName);
    const data = await readFile(file);

    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
  } catch (err) {
    res.writeHead(404);
    res.write('Not Found!');
  }

  res.end();
};

export const server = http.createServer(async(req, res) => {
  if (/^\/test\/?(index.html)?($|\?.*)/.test(req.url)) {
    const test = await readFile(path.join(testDir, 'index.html'));

    res.write(test);

    return res.end();
  }

  const ext = /(css|js)$/.exec(req.url.toString());

  if (ext) {
    const ctype = ext[1] === 'css' ? 'text/css' : 'text/javascript';

    return sendFileContent(res, req.url.toString().slice(1), ctype);
  }

  res.end();
}).listen(port, () => {
  console.log(`Test server started at http://localhost:${port}`);
  console.log(chalk.red('Don\'t forget to run `yarn watch` in a separate terminal window/tab'));
  console.log('View QUnit tests:', chalk.cyan(`http://localhost:${port}/test/`));
});
