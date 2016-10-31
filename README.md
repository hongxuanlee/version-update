# version-update

[![Build Status](https://travis-ci.org/hongxuanlee/version-update.svg?branch=master)](https://travis-ci.org/hongxuanlee/version-update)
[![Coverage Status](https://coveralls.io/repos/github/hongxuanlee/version-update/badge.svg?branch=master)](https://coveralls.io/github/hongxuanlee/version-update?branch=master)

## usage

```
const updateMain = require('version-update');
    updateMain({
      moduleName: 'lodash',
      version: '4.0.0',
      path: p
    }).then((data) => {
      // data
    };

```

## test

