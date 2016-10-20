require('shell/global');
let fs = require('mz/fs');
let updateModule = (module, version, suffix) => {
  let mode = suffix ? '--save' : suffix;
  if (exec('npm install ' + module + '@' + version + ' ' + mode) !== 0) {
    throw new Error(module + 'install failed');
  }
  var newVersion = exec('npm -v ' + module).stdout
  return {
    module,
    version,
    newVersion
  }
}

let checkExist = (name, data) => {
  if (!data) {

  }
  if (data.dependencies && data.dependencies[name]) {
    return '--save';
  }
  if (data.devDependencies && data.devDependencies[name]) {
    return '--save-dev';
  }
  return false;
}

let checkModule = function*(packPath, name) {
  
    let content = yield fs.readFile(packPath);
    let moduleInfo;
    try {
      moduleInfo = JSON.parse(content);
    } catch (e) {
      throw new TypeError('parse json error, path is ' + packPath);
    }
    return checkExist(name, moduleInfo);
}

let handleModule = function*(p, name, version) {
  let mode = yield checkModule(p, name);
  if (!mode) {
    return false;
  }
  let res = yield updateModule(name, version, mode);
  return res;
}

let updateModule = function*(options){
  let name = options.moduleName;
  if(!name || options.path) {
    throw new Error('not input valid module Name')
  } 
  let p = join(options.path)
  let packPath = path.join(p, 'package.json');
  if (yield fs.exists(packPath)) {
     return yield handleModule(p, name, options.version)
  }else{
     ls(p).forEach(*(dirname) => {
        yield updateModule({
           moduleName: name,
           path: path.join(p, dirname),
           version: options.version
        })
     });  
  }
} 

module.exports = updateModule;
