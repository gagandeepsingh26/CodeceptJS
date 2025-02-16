const { print, success, error } = require('../output');
const colors = require('chalk');
const fs = require('fs');
const path = require('path');
const { fileExists, beautify } = require('../utils');
const inquirer = require('inquirer');
const getTestRoot = require('./utils').getTestRoot;
const isLocal = require('../utils').installedLocally();
const mkdirp = require('mkdirp');
const { inspect } = require('util');

const defaultConfig = {
  tests: './*_test.js',
  output: '',
  helpers: {},
  include: {},
  bootstrap: null,
  mocha: {},
};

const helpers = ['WebDriver', 'Puppeteer', 'TestCafe', 'Protractor', 'Nightmare', 'Appium'];
const translations = Object.keys(require('../../translations'));

const noTranslation = 'English (no localization)';
translations.unshift(noTranslation);

let packages;

const defaultActor = `
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

  });
}
`;


module.exports = function (initPath) {
  const testsPath = getTestRoot(initPath);

  print();
  print(`  Welcome to ${colors.magenta.bold('CodeceptJS')} initialization tool`);
  print('  It will prepare and configure a test environment for you');
  print();


  if (!path) {
    print('No test root specified.');
    print(`Test root is assumed to be ${colors.yellow.bold(testsPath)}`);
    print('----------------------------------');
  } else {
    print(`Installing to ${colors.bold(testsPath)}`);
  }

  if (!fileExists(testsPath)) {
    print(`Directory ${testsPath} does not exist, creating...`);
    mkdirp.sync(testsPath);
  }

  const configFile = path.join(testsPath, 'codecept.conf.js');
  if (fileExists(configFile)) {
    error(`Config is already created at ${configFile}`);
    return;
  }


  inquirer.prompt([
    {
      name: 'tests',
      type: 'input',
      default: './*_test.js',
      message: 'Where are your tests located?',
    },
    {
      name: 'helper',
      type: 'list',
      choices: helpers,
      message: 'What helpers do you want to use?',
    },
    {
      name: 'output',
      default: './output',
      message: 'Where should logs, screenshots, and reports to be stored?',
    },
    {
      name: 'steps',
      type: 'confirm',
      message: 'Would you like to extend the "I" object with custom steps?',
      default: true,
    },
    {
      name: 'steps_file',
      type: 'input',
      message: 'Where would you like to place custom steps?',
      default: './steps_file.js',
      when(answers) {
        return answers.steps;
      },
    },
    {
      name: 'translation',
      type: 'list',
      message: 'Do you want to choose localization for tests?',
      choices: translations,
    },
  ]).then((result) => {
    const config = defaultConfig;
    config.name = testsPath.split(path.sep).pop();
    config.output = result.output;

    config.tests = result.tests;
    // create a directory tests if it is included in tests path
    const matchResults = config.tests.match(/[^*.]+/);
    if (matchResults) {
      mkdirp.sync(path.join(testsPath, matchResults[0]));
    }

    // append file mask to the end of tests
    if (!config.tests.match(/\*(.*?)$/)) {
      config.tests = `${config.tests.replace(/\/+$/, '')}/*_test.js`;
      console.log(`Adding default test mask: ${config.tests}`);
    }

    if (result.translation !== noTranslation) config.translation = result.translation;

    const helperName = result.helper;
    config.helpers[helperName] = {};

    let helperConfigs = [];

    try {
      const Helper = require(`../helper/${helperName}`);
      if (Helper._checkRequirements) {
        packages = Helper._checkRequirements();
      }

      if (!Helper._config()) return;
      helperConfigs = helperConfigs.concat(Helper._config().map((config) => {
        config.message = `[${helperName}] ${config.message}`;
        config.name = `${helperName}_${config.name}`;
        config.type = config.type || 'input';
        return config;
      }));
    } catch (err) {
      error(err);
    }

    const finish = () => {
      if (result.steps_file) {
        const stepFile = path.join(testsPath, result.steps_file);
        if (!fileExists(path.dirname(stepFile))) {
          mkdirp.sync(path.dirname(stepFile));
        }
        fs.writeFileSync(stepFile, defaultActor);
        config.include.I = result.steps_file;
        success(`Steps file created at ${stepFile}`);
      }

      const tsconfig = {
        compilerOption: {
          allowJs: true,
        },
      };
      const tsconfigJson = beautify(JSON.stringify(tsconfig));
      const tsconfigFile = path.join(testsPath, 'tsconfig.json');
      if (fileExists(tsconfigFile)) {
        print(`tsconfig.json has already exists at ${tsconfigFile}`);
      } else {
        fs.writeFileSync(tsconfigFile, tsconfigJson);
        success(`TypeScript project configuration file created at ${tsconfigFile}`);
      }

      fs.writeFileSync(configFile, beautify(`exports.config = ${inspect(config, false, 4, false)}`), 'utf-8');
      success(`Config created at ${configFile}`);

      if (config.output) {
        if (!fileExists(config.output)) {
          mkdirp.sync(path.join(testsPath, config.output));
          success(`Directory for temporary output files created at '${config.output}'`);
        } else {
          print(`Directory for temporary output files is already created at '${config.output}'`);
        }
      }
      success('Almost done! Create your first test by executing `npx codeceptjs gt` (generate test) command');

      if (packages) {
        print('\n--');
        if (isLocal) {
          print(`Please install dependent packages locally: ${colors.bold(`npm install --save-dev ${packages.join(' ')}`)}`);
        } else {
          print(`Please install dependent packages globally: [sudo] ${colors.bold(`npm install -g ${packages.join(' ')}`)}`);
        }
      }
    };

    print('Configure helpers...');
    inquirer.prompt(helperConfigs).then((helperResult) => {
      Object.keys(helperResult).forEach((key) => {
        const parts = key.split('_');
        const helperName = parts[0];
        const configName = parts[1];
        if (!configName) return;
        config.helpers[helperName][configName] = helperResult[key];
      });

      finish();
    });
  });
};
