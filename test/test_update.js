const expect = require('chai').expect;
const fs = require('mz/fs');
const path = require('path');
const npmUpdate = require('../index.js');

describe('version update', function() {
  it('should update version', function(done) {
    var p = path.join(__dirname, 'feature/test1');
    console.log(p);
    npmUpdate(p, 'lodash', '4.0.0').then((data) => {
      console.log('done', data); 
      done();
    }).catch(function(e){
      console.log('error', e);
    });
  })
});
