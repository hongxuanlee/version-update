require('shelljs/global');
const path = require('path');
let fs = require('mz/fs');
let updateModule = (module, version, suffix) => {
  let mode = suffix ? '--save' : suffix;
  if (exec('npm install ' + module + '@' + version + ' ' + mode).code !== 0) {
    throw new Error(module + ' install failed');
  }
  var testRes = exec('npm test'); 
  if(testRes.code !== 0){
    throw new Error(module + ' test failed ' + testRes.stderr);
  }
  var versionStr = exec('npm list -depth 1 | grep ' + module).stdout.trim();
  var newVersion = versionStr.replace(/.*lodash@/,'');
  return {
    module,
    version,
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

let handleModule = function(p, name, version) {
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
      return updateModule(name, version, mode);
    })
  })
}


let main = function(options) {
  let name = options.moduleName;
  if (!name || options.path) {
    throw new Error('not input valid module Name')
  }
  let p = join(options.path)
  let packPath = path.join(p, 'package.json');
  if (fs.exists(packPath)) {
    return handleModule(p, name, options.version)
  } else {
    ls(p).forEach(function*(dirname) {
      updateModule({
        moduleName: name,
        path: path.join(p, dirname),
        version: options.version
      })
    });
  }
}

module.exports = handleModule;
