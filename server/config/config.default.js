/* eslint valid-jsdoc: "off" */

'use strict';
let path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_894416038';

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
      // headerName: 'x-csrf-token'
    },
    domainWhiteList: ['http://localhost:8080']
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  // add your middleware config here
  config.middleware = [];

  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '127.0.0.1',
    }
  }

  // static
  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, '/app/public/')
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
