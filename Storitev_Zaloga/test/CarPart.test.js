import request from 'supertest';
import express from 'express';
import part from '../routes/CarPartRoutes';


const app = express();
app.use(express.json());
app.use('/part', part);


describe('Backend tests nodeJS express', () => {

    it('Should respond with status 200 on /part with filled body POST', async () => {
      const invalidvalidPart = {
        name: 'Avocado_CI_Test',
        calorie: '123',
      };
      const response = await request(app).post('/part').send(invalidvalidPart);
      expect(response.status).toBe(400);
    });

    it('Should respond with status 400 on /part with empty body POST', async () => {
    const response = await request(app).post('/part');
    expect(response.status).toBe(400);
  });


});