const request = require('supertest');
const app = require('../app.js');

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /locks', () => {
  it('should return 302 Found', (done) => {
    request(app)
      .get('/locks')
      .expect(302, done);
  });
});

describe('GET /cards', () => {
  it('should return 302 Found', (done) => {
    request(app)
      .get('/cards')
      .expect(302, done);
  });
});

describe('GET /access-log', () => {
  it('should return 302 Found', (done) => {
    request(app)
      .get('/access-log')
      .expect(302, done);
  });
});

describe('GET /api/v1/access', () => {
  it('should return 400 Bad Request', (done) => {
    request(app)
      .get('/api/v1/access')
      .expect(400, done);
  });
});

describe('GET /api/v1/access?lock=test&card=test', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/v1/access?lock=test&card=test')
      .expect('Content-type', /json/)
      .expect(200, { test: false }, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});
