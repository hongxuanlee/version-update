const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const fs = require('mz/fs');
const path = require('path');

const updateMain = require('../index.js');

describe('path version update', () => {
  beforeEach(() => {
    let p = path.join(__dirname, 'fixture/test5/test5_1');
    let p1 = path.join(__dirname, 'fixture/test1');
    cd(p);
    exec('npm install lodash@4.16.5 --save');
    cd(p1);
    exec('npm install lodash@4.16.5 --save');
  });

  it('should update dir version', (done) => {
    let p = path.join(__dirname, 'fixture/test5');
    updateMain({
      moduleName: 'lodash',
      version: '4.0.0',
      path: p
    }).then((data) => {
      expect(data).to.deep.equal([{
        status: 0,
        path: path.join(p, 'test5_1'),
        moduleName: 'lodash',
        oldVersion: '4.16.5',
        newVersion: '4.0.0'
      }]);
      done();
    });
  });
  it('should throw version format error', () => {
    let p = path.join(__dirname, 'fixture/test5');
    updateMain({
      moduleName: 'lodash',
      version: '400',
      path: p
    }).should.be.rejected;
  });
  it('should update dir version recursive', (done) => {
    let p = path.join(__dirname, 'fixture');
    updateMain({
      moduleName: 'lodash',
      version: '4.0.0',
      path: p
    }).then((data) => {
      expect(data[0]).to.deep.equal({
        status: 0,
        path: path.join(p, 'test1'),
        moduleName: 'lodash',
        oldVersion: '4.16.5',
        newVersion: '4.0.0'
      });
      expect(data[3]).to.deep.equal({
        status: 0,
        moduleName: 'lodash',
        oldVersion: '4.16.5',
        newVersion: '4.0.0',
        path: path.join(p, 'test5/test5_1')
      });
      done();
    });
  });
});
