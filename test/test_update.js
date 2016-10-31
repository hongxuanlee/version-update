const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const fs = require('mz/fs');
const path = require('path');
require('shelljs/global');

const versionUpdate = require('../index.js');
const npmUpdate = (p, name, version) => versionUpdate({
  moduleName: name,
  path: p,
  version
});

describe('version update', function() {
  before(() => {
    let p = path.join(__dirname, 'fixture/test1');
    cd(p);
    exec('npm install lodash@4.16.5 --save');
  });
  it('should update version', (done) => {
    let p = path.join(__dirname, 'fixture/test1');
    npmUpdate(p, 'lodash', '4.0.0').then((data) => {
      expect(data).to.deep.equal({
        status: 0,
        path: p,
        moduleName: 'lodash',
        oldVersion: '4.16.5',
        newVersion: '4.0.0'
      });
      done();
    });
  });

  it('should throw json parse error', (done) => {
    let p = path.join(__dirname, 'fixture/test2');
    npmUpdate(p, 'lodash', '4.0.0').then((data) => {
       expect(data.status).to.equal('-1');
       done();
    });
  });

  it('if not dep, should return false', () => {
    let p = path.join(__dirname, 'fixture/test3');
    return npmUpdate(p, 'lodash', '4.0.0').should.eventually.equal(false);
  });

  it('if test not pass, should thow error', (done) => {
    let p = path.join(__dirname, 'fixture/test4');
    npmUpdate(p, 'lodash', '4.0.0').then((data) => {
       expect(data.status).to.equal('-1');
       done();
    });
  });

});
