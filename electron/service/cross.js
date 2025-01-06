'use strict';

const { Service } = require('ee-core');
const Cross = require('ee-core/cross');
const Log = require('ee-core/log');
const Ps = require('ee-core/ps');
const path = require("path");
const Is = require('ee-core/utils/is');

/**
 * cross（service层为单例）
 * @class
 */
class CrossService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * create go service
   * In the default configuration, services can be started with applications. 
   * Developers can turn off the configuration and create it manually.
   */   
  async createGoServer() {
    // method 1: Use the default Settings
    //const entity = await Cross.run(serviceName);

    // method 2: Use custom configuration
    const serviceName = "go";
    const opt = {
      name: 'goapp',
      cmd: path.join(Ps.getExtraResourcesDir(), 'goapp'),
      directory: Ps.getExtraResourcesDir(),
      args: ['--port=7073'],
      appExit: true,
    }
    const entity = await Cross.run(serviceName, opt);
    Log.info('server name:', entity.name);
    Log.info('server config:', entity.config);
    Log.info('server url:', entity.getUrl());

    return;
  }

  /**
   * create java server
   */
  async createJavaServer() {
    const serviceName = "java";
    const jarPath = path.join(Ps.getExtraResourcesDir(), 'java-app.jar');
    const opt = {
      name: 'javaapp',
      cmd: path.join(Ps.getExtraResourcesDir(), 'jre1.8.0_201/bin/javaw.exe'),
      directory: Ps.getExtraResourcesDir(),
      args: ['-jar', '-server', '-Xms512M', '-Xmx512M', '-Xss512k', '-Dspring.profiles.active=prod', `-Dserver.port=18080`, `-Dlogging.file.path=${Ps.getLogDir()}`, `${jarPath}`],
      appExit: false,
    }
    if (Is.macOS()) {
      // Setup Java program
      opt.cmd = path.join(Ps.getExtraResourcesDir(), 'jre1.8.0_201.jre/Contents/Home/bin/java');
    }
    if (Is.linux()) {
      // Setup Java program
    }

    const entity = await Cross.run(serviceName, opt);
    Log.info('server name:', entity.name);
    Log.info('server config:', entity.config);
    Log.info('server url:', Cross.getUrl(entity.name));

    return;
  }  

  /**
   * create python service
   * In the default configuration, services can be started with applications. 
   * Developers can turn off the configuration and create it manually.
   */   
  async createPythonServer() {
    // method 1: Use the default Settings
    //const entity = await Cross.run(serviceName);

    // method 2: Use custom configuration
    const serviceName = "python";
    const opt = {
      name: 'pyapp',
      cmd: path.join(Ps.getExtraResourcesDir(), 'py', 'pyapp'),
      directory: path.join(Ps.getExtraResourcesDir(), 'py'),
      args: ['--port=7074'],
      windowsExtname: true,
      appExit: true,
    }
    const entity = await Cross.run(serviceName, opt);
    Log.info('server name:', entity.name);
    Log.info('server config:', entity.config);
    Log.info('server url:', entity.getUrl());

    return;
  }
  /**
   * create thinkphp service
   * 启动ThinkPHP服务进程
   */
  async createThinkphpServer() {
    const serviceName = "tp";
    const opt = {
      name: 'tpapi',
      // 修改：直接使用 PHP 可执行文件作为 cmd
      cmd: path.join(Ps.getExtraResourcesDir(), 'php-7.3/php'),
      // 修改：设置正确的工作目录
      directory: path.join(Ps.getExtraResourcesDir(), 'api'),
      // 修改：调整参数格式
      args: ['think', 'run', '--port=8000'],
      appExit: true,
    }

    const entity = await Cross.run(serviceName, opt);
    Log.info('server name:', entity.name);
    Log.info('server config:', entity.config);
    Log.info('server url:', Cross.getUrl(entity.name));

    return;
  }
}

CrossService.toString = () => '[class CrossService]';
module.exports = CrossService;  