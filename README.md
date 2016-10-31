# version-update

for npm module update

[![Build Status](https://travis-ci.org/hongxuanlee/version-update.svg?branch=master)](https://travis-ci.org/hongxuanlee/version-update)
[![Coverage Status](https://coveralls.io/repos/github/hongxuanlee/version-update/badge.svg?branch=master)](https://coveralls.io/github/hongxuanlee/version-update?branch=master)

## usage

- parameter: `options = {}`

```js
  options = {
    moduleName, // module name to update
    version，// optional, module version you want to update
    path，//module path, if is not module path, ergodic sub dir to update module path 
   }
```

- return: 

1. Object: if input path is module path, return object

```js
  {
     status, // 0 is success, -1 is failed
     path,
     moduleName, 
     oldVersion, // only success have this property
     newVersion // only success have this property
  }
```

2.Array: if input path not module path. will update sub file recursively, return array

```js
  [
    obj, // object is the same as the above
  ]
```


- example 

```js
const updateMain = require('version-update');
updateMain({
   moduleName: 'lodash',
   version: '4.0.0',
   path: path
}).then((data) => {
      // data
};

```

## test

```
npm test
```

## test coverage

```
npm run cov
```
