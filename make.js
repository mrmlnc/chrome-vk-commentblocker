'use strict';

const path = require('path');
const fs = require('fs');

const mkdirp = require('mkdirp');
const pify = require('pify');
const syncy = require('syncy');
const ts = require('typescript');

const mkdir = pify(mkdirp);
const readdir = pify(fs.readdir);
const readFile = pify(fs.readFile);
const writeFile = (filepath, data) => {
  return mkdir(path.dirname(filepath)).then(() => pify(fs.writeFile)(filepath, data));
};

const browsers = [
  'chrome',
  'edge',
  'firefox',
  'opera'
];

function readJsonFile(filepath) {
  return readFile(filepath, 'utf-8').then(JSON.parse);
}

function writeJsonFile(filepath, data) {
  return writeFile(filepath, JSON.stringify(data, null, '  '));
}

function copyCommonExtensionFiles(browserName) {
  const files = [
    'extensions/common/**/*',
    '!extensions/common/scripts/**/*'
  ];

  return syncy(files, `builds/${browserName}`, { base: 'extensions/common' });
}

function copyExtensionFiles(files) {
  return Promise.all(files.map((file) => syncy(file.src, file.dest, {
    base: 'extensions/common',
    updateAndDelete: false
  })));
}

function compileTypeScriptFiles(files) {
  const options = {
    compilerOptions: {
      target: 'es5',
      module: ts.ModuleKind.CommonJS
    }
  };

  return Promise.all(files.map((file) => {
    const fileName = path.basename(file.src, '.ts');

    return readFile(file.src, 'utf-8').then((data) => {
      return writeFile(`${file.dest}/${fileName}.js`, ts.transpile(data, options));
    });
  }));
}

function updateJsonFiles(files) {
  return Promise.all(files.map((file) => {
    const arrayOfPromises = [
      readJsonFile(file.src),
      readJsonFile(file.dest)
    ];

    return Promise.all(arrayOfPromises).then((data) => {
      return writeJsonFile(file.dest, Object.assign(data[1], data[0]));
    });
  }));
}

function extensionFilesHandling(browserName) {
  const filesToCopy = [];
  const tsFiles = [];
  const jsonFiles = [];

  return readdir(`extensions/${browserName}`).then((files) => {
    files.forEach((fileName) => {
      const fileExt = path.extname(fileName);

      if (fileExt === '.ts') {
        return tsFiles.push({
          src: `extensions/${browserName}/${fileName}`,
          dest: `builds/${browserName}`
        });
      }

      if (fileExt === '.json') {
        return jsonFiles.push({
          src: `extensions/${browserName}/${fileName}`,
          dest: `builds/${browserName}/${fileName}`
        });
      }

      filesToCopy.push({
        src: `extensions/${browserName}/${fileName}`,
        dest: `builds/${browserName}`
      });
    });

    return Promise.all([
      copyExtensionFiles(filesToCopy),
      compileTypeScriptFiles(tsFiles),
      updateJsonFiles(jsonFiles)
    ]);
  });
}

function makeBrowserExtension(browserName) {
  const compileCommonScripts = readdir('extensions/common/scripts').then((files) => {
    files = files.map((fileName) => ({
      src: `extensions/common/scripts/${fileName}`,
      dest: `builds/${browserName}/scripts`
    }));

    return compileTypeScriptFiles(files);
  });

  return copyCommonExtensionFiles(browserName)
    .then(() => Promise.all([
      compileCommonScripts,
      extensionFilesHandling(browserName)
    ]))
    .then(() => {
      console.log(`Done: ${browserName}`);
    });
}

Promise.all(browsers.map(makeBrowserExtension)).then(() => {
  console.log('--');
  console.log('All done.');
}).catch((err) => {
  console.error(err);
});
