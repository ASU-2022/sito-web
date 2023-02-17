const request = require('supertest');
const app=require('./server');

describe('GET auleStudios', () => {

  // Moking User.findOne method
  
  let aulaStudioSpy;
  
  beforeAll( () => {
    const AulaStudio = require('./models/aulaStudio');
    aulaStudioSpy = jest.spyOn(AulaStudio, 'findOne').mockImplementation((criterias) => {
      return {
        id: '639c5a9da427dfb3ea70a912',
        nome: 'BUC'
      };
    });
  });

  afterAll(async () => {
      aulaStudioSpy.mockRestore();
  });

  test('GET auleStudios should respond with an array of aule studio', async () => {
    return request(app).get('/auleStudios').expect('Content-Type', /json/).expect(200).then( (res) => {
              if(res.body && res.body[0]) {
                  expect(res.body[0]).toEqual({
                   self: 'auleStudios/639c5a9da427dfb3ea70a912',
                   nome : 'BUC'
                  });
              };
          });
  });

  test('GET auleStudios should respond with an aula studio', async () => {
    const response = await request(app).get('/auleStudios/639c5a9da427dfb3ea70a912');
    expect(response.statusCode).toBe(200);
  });



})

describe('Testing post aula studio', function() {
    it('should respond with 201', function(done) {
      request(app)
        .post('/auleStudios')
        .send({nome:"Prova",locazione:"Ciago",posti_disponibili:"10",QR_code:"ciago22"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
            return done();
        });
  });
});