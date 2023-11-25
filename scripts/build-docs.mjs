import path from 'path';

import {isCliCall, readFile, outputFile, Markdown, jsdoc2md} from './esm.mjs';


import {cleanMarkdown} from './clean-markdown.mjs';

const projRoot = process.cwd();

const renderAPI = async(files) => {
  const output = await jsdoc2md.render({
    files,
    partial: path.join(projRoot, 'scripts/partials/*.hbs'),
    // @ts-ignore
    'module-index-format': 'list',
  });

  return output;
};
const buildMarkdown = async(files) => {
  let content = '';

  try {
    const output = await renderAPI(files);
    const intro = await readFile(path.join(projRoot, 'scripts/partials', 'intro.md'));

    content = [intro, output].join('\n');
  } catch (err) {
    console.log(err);
  }

  return `<!-- markdownlint-disable MD036 -->\n${content}`;
};

const md2html = (content) => {
  // eslint-disable-next-line new-cap
  const md = Markdown({
    html: true,
    typographer: true,
  });

  return md.render(content);
};

export const outputAPI = async(files) => {
  const content = await buildMarkdown(files);

  try {
    const apiMdFile = path.join(projRoot, 'scripts/api.md');

    await outputFile(apiMdFile, content);

    const md = await cleanMarkdown(apiMdFile);

    console.log('Finished building README.md!!');
    const html = md2html(md);
    const readmeHtml = `
<html>
  <head>
  <title>BAMF JS</title>
  <style>
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    body,
    input,
    textarea,
    select {
      font-size: 100%;
    }
  </style>
  </head>
  <body>
    ${html}
  </body>
</html>`;

    await outputFile(path.join(projRoot, 'README.html'), readmeHtml);
  } catch (err) {
    console.log(err);
  }
};

if (isCliCall(import.meta)) {
  // outputReadme(path.join(projRoot, 'src/*.js'));
  outputAPI(path.join(projRoot, 'src/*.js'));
}
