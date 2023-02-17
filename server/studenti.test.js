const request = require('supertest');
const jwt=require('jsonwebtoken'); // used to create, sign, and verify tokens
const app=require('./server');

describe('GET /studentis/me', () => {

    // Moking User.findOne method
  
    let studenteSpy;
  
    beforeAll( () => {
      const Studente = require('./models/studenti');
      studenteSpy = jest.spyOn(Studente, 'findOne').mockImplementation((criterias) => {
        return {
          id: '639c592fa427dfb3ea70a90c',
          email: 'manu.vettorazzi@studenti.unitn.it'
        };
      });
    });
  
    afterAll(async () => {
      studenteSpy.mockRestore();
    });
    
    test('GET studentis/me with no token should return 401', async () => {
      const response = await request(app).get('/studentis/me');
      expect(response.statusCode).toBe(401);
    });
  
    test('GET studentis/me?token=<invalid> should return 403', async () => {
      const response = await request(app).get('/studentis/me?token=123456');
      expect(response.statusCode).toBe(403);
    });
  
    // create a valid token
    var payload = {
      email: 'manu.vettorazzi@studenti.unitn.it'
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, "ASU", options);
        
    test('GET studentis/me?token=<valid> should return 200', async () => {
      expect.assertions(1);
      const response = await request(app).get('/studentis/me?token='+token);
      expect(response.statusCode).toBe(403);
    });
    
    test('GET studentis/639c592fa427dfb3ea70a90c should respond with "informazioni studente" ', async () => {
      const response = await request(app).get('/studentis/639c592fa427dfb3ea70a90c');
      expect(response.statusCode).toBe(203);
    });
});