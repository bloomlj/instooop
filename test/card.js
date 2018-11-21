const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Card = require('../models/Card');

describe('Card Model', () => {
  it('should create a new card', (done) => {
    const CardMock = sinon.mock(new Card({ uid: 'abcdefgh', name: 'cardName', description: 'Random description' }));
    const card = CardMock.object;

    CardMock
      .expects('save')
      .yields(null);

    card.save((err) => {
      CardMock.verify();
      CardMock.restore();
      expect(err).to.equal(null);
      done();
    });
  });

  it('should return error if card is not created', (done) => {
    const CardMock = sinon.mock(new Card({ uid: 'abcdefgh', name: 'cardName', description: 'Random description' }));
    const card = CardMock.object;
    const expectedError = {
      name: 'ValidationError'
    };

    CardMock
      .expects('save')
      .yields(expectedError);

    card.save((err, result) => {
      CardMock.verify();
      CardMock.restore();
      expect(err.name).to.equal('ValidationError');
      expect(result).to.equal(undefined);
      done();
    });
  });

  it('should not create a card with the unique uid', (done) => {
    const CardMock = sinon.mock(Card({ uid: 'abcdefgh', name: 'cardName', description: 'Random description' }));
    const card = CardMock.object;
    const expectedError = {
      name: 'MongoError',
      code: 11000
    };

    CardMock
      .expects('save')
      .yields(expectedError);

    card.save((err, result) => {
      CardMock.verify();
      CardMock.restore();
      expect(err.name).to.equal('MongoError');
      expect(err.code).to.equal(11000);
      expect(result).to.equal(undefined);
      done();
    });
  });

  it('should find card by uid', (done) => {
    const cardMock = sinon.mock(Card);
    const expectedCard = {
      uid: 'abcdefgh',
      name: 'cardName',
      description: 'Random description'
    };

    cardMock
      .expects('findOne')
      .withArgs({ uid: 'abcdefgh' })
      .yields(null, expectedCard);

    Card.findOne({ uid: 'abcdefgh' }, (err, result) => {
      cardMock.verify();
      cardMock.restore();
      expect(result.name).to.equal('cardName');
      done();
    });
  });

  it('should remove card by uid', (done) => {
    const cardMock = sinon.mock(Card);
    const expectedResult = {
      nRemoved: 1
    };

    cardMock
      .expects('remove')
      .withArgs({ uid: 'abcdefgh' })
      .yields(null, expectedResult);

    Card.remove({ uid: 'abcdefgh' }, (err, result) => {
      cardMock.verify();
      cardMock.restore();
      expect(err).to.equal(null);
      expect(result.nRemoved).to.equal(1);
      done();
    });
  });
});
