import request from 'supertest';
import express from 'express';
import carPartsRoutes from '../routes/CarPartRoutes';
import app from '../app';  // Import the app which contains the MongoDB connection and routes

describe('Backend tests for CarPart API', () => {
  
  // Test for GET /parts route (Fetch all car parts)
  it('Should respond with status 200 on /parts GET', async () => {
    const response = await request(app).get('/parts');
    expect(response.status).toBe(200);
  });

  // Test for POST /parts with empty body (Expecting 400 Bad Request)
  it('Should respond with status 400 on /parts with empty body POST', async () => {
    const response = await request(app).post('/parts');
    expect(response.status).toBe(400);
  });

  // Test for POST /parts with invalid car part data (Expecting 400 Bad Request)
  it('Should respond with status 400 on /parts with invalid car part data POST', async () => {
    const carPart = {
      x: 'invalid data'
    };

    const response = await request(app).post('/parts').send(carPart);
    expect(response.status).toBe(400); // Expecting 400 for invalid data
  });

  // Test for POST /parts with valid car part data (Expecting 201 Created)
  it('Should respond with status 201 on /parts with valid car part data POST', async () => {
    const carPart = {
      name: 'Engine Part',
      partNumber: 'EP123',
      category: 'Engine',
      manufacturer: 'Acme Inc.',
      price: 100,
      stock: 50,
      description: 'A test engine part'
    };

    const response = await request(app).post('/parts').send(carPart);
    expect(response.status).toBe(201); // Expecting 201 for successful creation
  });

  // Test for GET /parts/:partNumber (Fetch a single car part by part number)
  it('Should respond with status 200 on /parts/:partNumber GET if part exists', async () => {
    const response = await request(app).get('/parts/EP123');
    expect(response.status).toBe(200);
  });

  // Test for GET /parts/:partNumber with non-existing part number (Expecting 404 Not Found)
  it('Should respond with status 404 on /parts/:partNumber GET if part does not exist', async () => {
    const response = await request(app).get('/parts/EP999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Car part not found' });
  });

  // Test for PUT /parts/:partNumber (Update a car part by part number)
  it('Should respond with status 200 on /parts/:partNumber PUT with valid data', async () => {
    const carPart = {
      name: 'Updated Engine Part',
      partNumber: 'EP123',
      category: 'Engine',
      manufacturer: 'Acme Inc.',
      price: 120,
      stock: 60,
      description: 'Updated description'
    };

    const response = await request(app).put('/parts/EP123').send(carPart);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(carPart)); // Expecting updated data
  });

  // Test for PUT /parts/:partNumber with non-existing part number (Expecting 404 Not Found)
  it('Should respond with status 404 on /parts/:partNumber PUT if part does not exist', async () => {
    const carPart = {
      name: 'Non-existent Engine Part',
      partNumber: 'EP999',
      category: 'Engine',
      manufacturer: 'Acme Inc.',
      price: 150,
      stock: 10,
      description: 'This part does not exist'
    };

    const response = await request(app).put('/parts/EP999').send(carPart);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Car part not found' });
  });

  // Test for DELETE /parts/:partNumber (Delete a car part by part number)
  it('Should respond with status 200 on /parts/:partNumber DELETE if part exists', async () => {
    const response = await request(app).delete('/parts/EP123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Car part deleted' });
  });

  // Test for DELETE /parts/:partNumber with non-existing part number (Expecting 404 Not Found)
  it('Should respond with status 404 on /parts/:partNumber DELETE if part does not exist', async () => {
    const response = await request(app).delete('/parts/EP999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Car part not found' });
  });
});