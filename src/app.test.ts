import request from 'supertest';
import app from './app';


describe('GET /', () => {
  it('Should say ok', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        expect(res.body === 'ok');
        done();
      })
  })
})

describe('GET /users', () => {
  it('Should error when providing no parameters', (done) => {
    request(app)
      .get('/users')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).toBe('Missing required parameters');
        done();
      })
  })
  it('Should error when providing false parameters', (done) => {
    request(app)
      .get('/users?foo=bar')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).toBe('Missing required parameters');
        done();
      })
  })
  it('Should error when all parameters are not numbers', (done) => {
    request(app)
      .get('/users?lat=fail&long=asd')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).toBe('Parameters should be numbers');
        done();
      })
  })
  it('Should error when lat is not number', (done) => {
    request(app)
      .get('/users?lat=fail&long=123')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).toBe('Parameters should be numbers');
        done();
      })
  })
  it('Should error when long is not number', (done) => {
    request(app)
      .get('/users?lat=11.22&long=notANumber')
      .expect(400)
      .end((err, res) => {
        expect(res.body.error).toBe('Parameters should be numbers');
        done();
      })
  })
  it('Should succeed when all parameters are numbers', (done) => {
    request(app)
      .get('/users?lat=10&long=20.0')
      .expect(200, done)
  })
  it('Should provide certain user when her exact location is given', (done) => {
    const lat = "-37.3159";
    const lng =	"81.1496";
    request(app)
      .get(`/users?lat=${lat}&long=${lng}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.name).toBe('Leanne Graham');
        expect(res.body.address.geo.lat).toBe(lat);
        expect(res.body.address.geo.lng).toBe(lng);
        done();
      })
  })
  it('Should provide user that is closest to the location', (done) => {
    const lat = "-37.3159";
    const lng =	"-130.0000";
    request(app)
      .get(`/users?lat=${lat}&long=${lng}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.name).toBe('Nicholas Runolfsdottir V');
        done();
      })
  })
  it('Should provide user that is closest to the location', (done) => {
    const lat = "-0.0000";
    const lng =	"-9001";
    request(app)
      .get(`/users?lat=${lat}&long=${lng}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.name).toBe('Glenna Reichert');
        done();
      })
  })
})