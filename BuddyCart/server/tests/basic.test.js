import {describe,it,expect} from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Basical Number',()=>{it('1+1 Should Equal 2',()=>{
    expect(1+1).toBe(2)
})
})

describe('ProductPort /api/products',()=>{
    it('Should have status 200 feedback',async()=>{
        const res=await request(app).get('/api/products')
        console.log('STATUS:', res.status);
        console.log('BODY TYPE:', typeof res.body);
        console.log('BODY KEYS:', Object.keys(res.body || {}));
        console.log('BODY SAMPLE:', JSON.stringify(res.body).slice(0, 300));
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.products)).toBe(true);
    })
});