import request from 'supertest';
import { app } from '../../server';
import mongoose from 'mongoose';

let token: string;
let userId: mongoose.Types.ObjectId;

beforeEach(async () => {
    await request(app).post('/api/auth/sign-up').send({
        name: 'Elon Musk',
        username: 'elonmusk',
        email: 'elonmusk@email.com',
        password: 'password',
        confirmPassword: 'password',
    });

    const response = await request(app).post('/api/auth/sign-in').send({
        email: 'elonmusk@email.com',
        password: 'password',
    });

    userId = response.body._id;

    const cookie = response.header['set-cookie'];
    token = cookie[0].split('access_token=')[1].split(';')[0];
});

describe('/POST /api/photos/create', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).post('/api/photos/create');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authenticated');
    });

    it('should return 400 if no image is provided', async () => {
        const response = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token}`]);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Image_url is required');
    });

    it('should return 201 if image is provided', async () => {
        const response = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
            });

        expect(response.status).toBe(201);
        expect(response.body.image_url).toBe('https://www.example.com/image.jpg');
    });
});
