import {describe,it,expect, beforeAll} from 'vitest';
import request from 'supertest';
import app from '../app';
import User from '../models/User.model'

beforeAll(async()=>{
  await User.deleteMany({});
})


describe('Auth /api/auth',()=>{
    it("Should register a new user successfully",async()=>{
        const res=await request(app)       
        .post('/api/auth/register')
        .send({
          name:'Test User',
          email:'testuser@example.com', 
          password: 'Passw0rd!'});
     console.log("REGISTER RES:",res.status,res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');

    
    });

    
        

    it("Should not allow duplicate registration",async()=>{
        await request(app)
        .post ('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email:'dup@example.com',
          password:'Passw0rd!'});
        const res=await request(app).
        post('/api/auth/register')
      .send({ name: 'Duplicate User',
              email: 'dup@example.com', 
              password: 'Passw0rd!' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    })

    it('should login successfully and return a JWT token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ 
        name:'Login user',
        email: 'login@example.com',
        password: 'Passw0rd!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ name:'Login user',
              email: 'login@example.com', 
              password: 'Passw0rd!' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});