require('shelljs/global');
const path = require('path');
const fs = require('mz/fs');
const promise = require('bluebird');
const semver = require('semver');
const _ = require('lodash');

let getVersion = (name) => {
  let verStr = exec(`npm list -depth 1 | grep ${name}`).stdout.trim();
  if(verStr.length === 0 ){
     return false;
  }
  let reg = new RegExp(`.*${name}@`);
  return verStr.replace(reg, '');
}

let updateModule = (module, version, suffix) => {
  let mode = suffix ? '--save' : suffix;
  let oldVersion = getVersion(module);  
  let ver = version ? ('@' + version) : '';
  if (exec('npm install ' + module + ver + ' ' + mode).code !== 0) {
    throw new Error(module + ' install failed');
  }
  let testRes = exec('npm test');
  if (testRes.code !== 0) {
    throw new Error(module + ' test failed ' + testRes.stderr);
  }
  let newVersion = getVersion(module);
  return {
    status: 0,
    moduleName: module,
    oldVersion,
    newVersion
  }
}

let checkExist = (name, data) => {
  if (data.dependencies && data.dependencies[name]) {
    return '--save';
  }
  if (data.devDependencies && data.devDependencies[name]) {
    return '--save-dev';
  }
  return false;
}

let checkModule = (packPath, name) => {
  return fs.readFile(packPath).then((content) => {
    let moduleInfo;
    try {
      moduleInfo = JSON.parse(content);
    } catch (e) {
      throw new TypeError('parse json error, path is ' + packPath);
    }
    return checkExist(name, moduleInfo);
  });
}

let handleModule = (p, name, version) => {
  if(version && !semver.valid(version)){
    throw Error(`${version} is not valid version format`);
  }
  let packPath = path.join(p, 'package.json');
  return fs.exists(packPath).then((isExist) => {
    if (!isExist) {
      return false;
    }
    return checkModule(packPath, name).then((mode) => {
      if (!mode) {
        return false;
      }
      cd(p);
      let info = updateModule(name, version, mode);
      info.path = p;
      return info;
    }).catch((err) => {
      return {
        status: '-1',
        errmsg: err,
        path: p
      };
    });
  })
}


let main = (options = {}) => {
  let name = options.moduleName;
  if (!name || !options.path) {
    throw new Error('not input valid module Name')
  }
  let p = path.join(options.path)
  let packPath = path.join(p, 'package.json');
  return fs.exists(packPath).then((isExist) => {
    if (isExist) {
      return handleModule(p, name, options.version)
    } else {
      let modulePaths = ls(p).map((dir) => {
        return path.join(p, dir);
      });
      return promise.all(modulePaths.map((mp) => {
        return main({
          path: mp,
          moduleName: name,
          version: options.version
        });
      })).then((data) => {
        data = _.flattenDeep(data);
        return data.filter((item) => {
           return item !== false;
        });
      });
    }
  });

}

module.exports = main;
