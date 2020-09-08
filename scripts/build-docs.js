const path = require('path');
const fs = require('fs-extra');
const jsdoc2md = require('jsdoc-to-markdown');
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

const outputAPI = async(files) => {
  try {
    const output = await renderAPI(files);
    const intro = await fs.readFile(path.join(__dirname, 'partials', 'intro.md'));
    const apiMd = path.join(__dirname, 'api.md');
    const content = [intro, output].join('\n');

    await fs.outputFile(apiMd, content);

    cleanMarkdown(apiMd, 'Finished building README.md!!');
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
