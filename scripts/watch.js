const chokidar = require('chokidar');
const chalk = require('chalk');
const {spawn} = require('child_process');

const dateTimeFormat = {weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric'};

const watchFiles = [
  'src/*.js',
  'test/*.js',
];

const watcher = chokidar.watch(watchFiles);

let isReady = false;

const readyMsg = () => {
  const d = new Date();
  const date = d.toLocaleDateString('en-US', dateTimeFormat);

  console.log(chalk.yellow(date));
  console.log(chalk.cyan(`Watching for file changes at ${watchFiles.join(', ')}`));
};

let test;
const runTest = () => {
  if (test) {
    test.kill();
  }
  test = spawn('npm', ['run', 'test']);
  test.stdout.on('data', (data) => {
    process.stdout.write(`${data}`);
  });

  test.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  test.on('close', (code) => {
    if (code) {
      console.log(`child process exited with code ${code}`);
    }
    readyMsg();
    test = null;
  });
};

// events in 'all': add, addDir, change, unlink, unlinkDir
// other events: ready, raw, error

watcher
.on('ready', () => {
  readyMsg();
  isReady = true;
})
.on('all', (event, path) => {
  if (!isReady) {
    return;
  }
  console.log(`${event} triggered at ${path}`);


  if (event === 'add') {
    watcher.add(path);
  }
  if (event === 'unlink') {
    watcher.unwatch(path);
  }

  if (event === 'change') {
    runTest();
  }
});
