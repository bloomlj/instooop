const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Lock = require('../models/Lock');

describe('Lock Model', () => {
  it('should create a new lock', (done) => {
    const LockMock = sinon.mock(new Lock({ uid: 'abcdefgh', name: 'lockName', description: 'Random description' }));
    const lock = LockMock.object;

    LockMock
      .expects('save')
      .yields(null);

    lock.save((err) => {
      LockMock.verify();
      LockMock.restore();
      expect(err).to.equal(null);
      done();
    });
  });

  it('should return error if lock is not created', (done) => {
    const LockMock = sinon.mock(new Lock({ uid: 'abcdefgh', name: 'lockName', description: 'Random description' }));
    const lock = LockMock.object;
    const expectedError = {
      name: 'ValidationError'
    };

    LockMock
      .expects('save')
      .yields(expectedError);

    lock.save((err, result) => {
      LockMock.verify();
      LockMock.restore();
      expect(err.name).to.equal('ValidationError');
      expect(result).to.equal(undefined);
      done();
    });
  });

  it('should not create a lock with the unique uid', (done) => {
    const LockMock = sinon.mock(Lock({ uid: 'abcdefgh', name: 'lockName', description: 'Random description' }));
    const lock = LockMock.object;
    const expectedError = {
      name: 'MongoError',
      code: 11000
    };

    LockMock
      .expects('save')
      .yields(expectedError);

    lock.save((err, result) => {
      LockMock.verify();
      LockMock.restore();
      expect(err.name).to.equal('MongoError');
      expect(err.code).to.equal(11000);
      expect(result).to.equal(undefined);
      done();
    });
  });

  it('should find lock by uid', (done) => {
    const lockMock = sinon.mock(Lock);
    const expectedLock = {
      uid: 'abcdefgh',
      name: 'lockName',
      description: 'Random description'
    };

    lockMock
      .expects('findOne')
      .withArgs({ uid: 'abcdefgh' })
      .yields(null, expectedLock);

    Lock.findOne({ uid: 'abcdefgh' }, (err, result) => {
      lockMock.verify();
      lockMock.restore();
      expect(result.name).to.equal('lockName');
      done();
    });
  });

  it('should remove lock by uid', (done) => {
    const lockMock = sinon.mock(Lock);
    const expectedResult = {
      nRemoved: 1
    };

    lockMock
      .expects('remove')
      .withArgs({ uid: 'abcdefgh' })
      .yields(null, expectedResult);

    Lock.remove({ uid: 'abcdefgh' }, (err, result) => {
      lockMock.verify();
      lockMock.restore();
      expect(err).to.equal(null);
      expect(result.nRemoved).to.equal(1);
      done();
    });
  });
});
