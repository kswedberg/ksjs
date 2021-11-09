const path = require('path');
const fs = require('fs-extra');
const jsdoc2md = require('jsdoc-to-markdown');
const Markdown = require('markdown-it');

const {cleanMarkdown} = require('./clean-markdown.js');
const projRoot = path.join(__dirname, '..');

const renderAPI = async(files) => {
  const output = await jsdoc2md.render({
    files,
    partial: path.join(__dirname, 'partials/*.hbs'),
    // @ts-ignore
    'module-index-format': 'list',
  });

  return output;
};
const buildMarkdown = async(files) => {
  let content = '';
  try {
    const output = await renderAPI(files);
    const intro = await fs.readFile(path.join(__dirname, 'partials', 'intro.md'));

    content = [intro, output].join('\n');
  } catch (err) {
    console.log(err);
  }

  return content;
};

const md2html = (content) => {
  const md = Markdown({
    html: true,
    typographer: true,
  });

  return md.render(content);
};

const outputAPI = async(files) => {
  const content = await buildMarkdown(files);
  try {
    const apiMdFile = path.join(__dirname, 'api.md');

    await fs.outputFile(apiMdFile, content);

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
</html>`
    await fs.outputFile(path.join(projRoot, 'README.html'), readmeHtml);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {outputAPI};

// @ts-ignore
if (!module.parent) {
  // outputReadme(path.join(projRoot, 'src/*.js'));
  outputAPI(path.join(projRoot, 'src/*.js'));
}
