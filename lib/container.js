const path = require('path');
const fileExists = require('./utils').fileExists;
const Translation = require('./translation');
const MochaFactory = require('./mochaFactory');
const recorder = require('./recorder');
const event = require('./event');

let container = {
  helpers: {},
  support: {},
  plugins: {},
  mocha: {},
  translation: {},
};

/**
 * Dependency Injection Container
 */
class Container {
  /**
   * Create container with all required helpers and support objects
   *
   * @api
   * @param {*} config
   * @param {*} opts
   */
  static create(config, opts) {
    const mochaConfig = config.mocha || {};
    if (config.grep && !opts.grep) {
      mochaConfig.grep = config.grep;
    }
    container.mocha = MochaFactory.create(mochaConfig, opts || {});
    container.helpers = createHelpers(config.helpers || {});
    container.translation = loadTranslation(config.translation || null);
    container.support = createSupportObjects(config.include || {});
    container.plugins = createPlugins(config.plugins || {}, opts);
    if (config.gherkin) loadGherkinSteps(config.gherkin.steps || []);
  }

  /**
   * Get all plugins
   *
   * @api
   * @param {string} [name]
   */
  static plugins(name) {
    if (!name) {
      return container.plugins;
    }
    return container.plugins[name];
  }

  /**
   * Get all support objects or get support object by name
   *
   * @api
   * @param {string} [name]
   */
  static support(name) {
    if (!name) {
      return container.support;
    }
    return container.support[name];
  }

  /**
   * Get all helpers or get a helper by name
   *
   * @api
   * @param {string} [name]
   */
  static helpers(name) {
    if (!name) {
      return container.helpers;
    }
    return container.helpers[name];
  }

  /**
   * Get translation
   *
   * @api
   */
  static translation() {
    return container.translation;
  }

  /**
   * Get Mocha instance
   *
   * @api
   */
  static mocha() {
    return container.mocha;
  }

  /**
   * Append new services to container
   *
   * @api
   */
  static append(newContainer) {
    const deepMerge = require('./utils').deepMerge;
    container = deepMerge(container, newContainer);
  }

  /**
   * Clear container
   *
   * @param {*} newHelpers
   * @param {*} newSupport
   */
  static clear(newHelpers, newSupport, newPlugins) {
    container.helpers = newHelpers || {};
    container.support = newSupport || {};
    container.plugins = newPlugins || {};
    container.translation = loadTranslation();
  }
}

module.exports = Container;

function createHelpers(config) {
  const helpers = {};
  let helperModule;
  let moduleName;
  for (const helperName in config) {
    try {
      if (config[helperName].require) {
        if (config[helperName].require.startsWith('.')) {
          moduleName = path.resolve(global.codecept_dir, config[helperName].require); // custom helper
        } else {
          moduleName = config[helperName].require; // plugin helper
        }
      } else {
        moduleName = `./helper/${helperName}`; // built-in helper
      }
      const HelperClass = require(moduleName);
      if (HelperClass._checkRequirements) {
        const requirements = HelperClass._checkRequirements();
        if (requirements) {
          let install;
          if (require('./utils').installedLocally()) {
            install = `npm install --save-dev ${requirements.join(' ')}`;
          } else {
            install = `[sudo] npm install -g ${requirements.join(' ')}`;
          }
          throw new Error(`Required modules are not installed.\n\nRUN: ${install}`);
        }
      }
      helpers[helperName] = new HelperClass(config[helperName]);
    } catch (err) {
      throw new Error(`Could not load helper ${helperName} from module '${moduleName}':\n${err.message}`);
    }
  }

  for (const name in helpers) {
    if (helpers[name]._init) helpers[name]._init();
  }
  return helpers;
}

function createSupportObjects(config) {
  const objects = container.support = new Proxy({}, {
    get(target, key) {
      // configured but not in support object, yet: load the module
      if (key in config && !(key in target)) target[key] = lazyLoad(key);
      return target[key];
    },
  });

  if (!config.I) {
    container.support.I = require('./actor')();

    if (container.translation.I !== 'I') {
      container.support[container.translation.I] = container.support.I;
    }
  }

  function lazyLoad(name) {
    let newObj = getSupportObject(config, name);
    try {
      if (typeof newObj === 'function') {
        newObj = newObj();
      } else if (newObj._init) {
        newObj._init();
      }
    } catch (err) {
      throw new Error(`Initialization failed for ${name}: ${newObj}\n${err.message}`);
    }
    return newObj;
  }
  const asyncWrapper = function (f) {
    return function () {
      return f.apply(this, arguments).catch((e) => {
        recorder.saveFirstAsyncError(e);
        throw e;
      });
    };
  };

  Object.keys(objects).forEach((object) => {
    const currentObject = objects[object];
    Object.keys(currentObject).forEach((method) => {
      const currentMethod = currentObject[method];
      if (currentMethod[Symbol.toStringTag] === 'AsyncFunction') {
        objects[object][method] = asyncWrapper(currentMethod);
      }
    });
  });

  return objects;
}

function createPlugins(config, options = {}) {
  const plugins = {};

  const enabledPluginsByOptions = (options.plugins || '').split(',');
  for (const pluginName in config) {
    if (!config[pluginName]) config[pluginName] = {};
    if (!config[pluginName].enabled && (enabledPluginsByOptions.indexOf(pluginName) < 0)) {
      continue; // plugin is disabled
    }
    let module;
    try {
      if (config[pluginName].require) {
        module = config[pluginName].require;
        if (module.startsWith('.')) { // local
          module = path.resolve(global.codecept_dir, module); // custom plugin
        }
      } else {
        module = `./plugin/${pluginName}`;
      }
      plugins[pluginName] = require(module)(config[pluginName]);
    } catch (err) {
      throw new Error(`Could not load plugin ${pluginName} from module '${module}':\n${err.message}`);
    }
  }
  return plugins;
}

function getSupportObject(config, name) {
  const module = config[name];
  if (typeof module === 'string') {
    return loadSupportObject(module, name);
  }
  return module;
}

function loadGherkinSteps(paths) {
  global.Before = fn => event.dispatcher.on(event.test.started, fn);
  global.After = fn => event.dispatcher.on(event.test.finished, fn);
  global.Fail = fn => event.dispatcher.on(event.test.failed, fn);

  for (const path of paths) {
    loadSupportObject(path, `Step Definition from ${path}`);
  }

  delete global.Before;
  delete global.After;
  delete global.Fail;
}

function loadSupportObject(modulePath, supportObjectName) {
  if (modulePath.charAt(0) === '.') {
    modulePath = path.join(global.codecept_dir, modulePath);
  }
  try {
    return require(modulePath);
  } catch (err) {
    throw new Error(`Could not include object ${supportObjectName} from module '${modulePath}'\n${err.message}`);
  }
}

function loadTranslation(translation) {
  if (!translation) {
    return new Translation({
      I: 'I',
      actions: {},
    }, false);
  }

  let vocabulary;
  // check if it is a known translation
  if (require('../translations')[translation]) {
    vocabulary = require('../translations')[translation];
    return new Translation(vocabulary);
  } else if (fileExists(path.join(global.codecept_dir, translation))) {
    // get from a provided file instead
    vocabulary = require(path.join(global.codecept_dir, translation));
  } else {
    throw new Error(`Translation option is set in config, but ${translation} is not a translated locale or filename`);
  }

  return new Translation(vocabulary);
}
