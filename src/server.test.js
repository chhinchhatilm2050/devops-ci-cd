import request from 'supertest';
import app from './app.js'

describe('Express API Tests', () => {
  
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
  
  // describe('POST /calculate', () => {
  //   it('should add two numbers', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'add', a: 5, b: 3 });
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.result).toBe(8);
  //   });
    
  //   it('should subtract two numbers', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'subtract', a: 10, b: 4 });
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.result).toBe(6);
  //   });
    
  //   it('should multiply two numbers', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'multiply', a: 6, b: 7 });
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.result).toBe(42);
  //   });
    
  //   it('should divide two numbers', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'divide', a: 20, b: 4 });
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.result).toBe(5);
  //   });
    
  //   it('should return error for division by zero', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'divide', a: 10, b: 0 });
      
  //     expect(response.status).toBe(400);
  //     expect(response.body.error).toBe('Cannot divide by zero');
  //   });
    
  //   it('should return error for missing fields', async () => {
  //     const response = await request(app)
  //       .post('/api/calculate')
  //       .send({ operation: 'add', a: 5 });
      
  //     expect(response.status).toBe(400);
  //     expect(response.body.error).toBe('Missing required fields');
  //   });
  // });
  
  // describe('GET /users', () => {
  //   it('should return all users', async () => {
  //     const response = await request(app).get('/api/users');
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.users).toHaveLength(2);
  //     expect(response.body.users[0]).toHaveProperty('name', 'Alice');
  //   });
  // });
  
  // describe('GET /users/:id', () => {
  //   it('should return user by id', async () => {
  //     const response = await request(app).get('/api/users/1');
      
  //     expect(response.status).toBe(200);
  //     expect(response.body.user).toHaveProperty('name', 'Alice');
  //   });
    
  //   it('should return 404 for non-existent user', async () => {
  //     const response = await request(app).get('/api/users/999');
      
  //     expect(response.status).toBe(404);
  //     expect(response.body.error).toBe('User not found');
  //   });
  // });
  
});