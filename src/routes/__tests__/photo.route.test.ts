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

describe('/GET /api/photos', () => {
    it('should return 200 and an array of photos', async () => {
        const response = await request(app).get('/api/photos');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('/GET /api/photos/:id', () => {
    it('should return 404 when photo is not found', async () => {
        const nonExistentPhotoId = new mongoose.Types.ObjectId();

        const response = await request(app).get(`/api/photos/${nonExistentPhotoId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Photo not found');
    });

    it('should return 200 when photo is found', async () => {
        const response1 = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
            });

        const response2 = await request(app).get(`/api/photos/${response1.body._id}`);

        expect(response2.status).toBe(200);
        expect(response2.body.image_url).toBe('https://www.example.com/image.jpg');
    });
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

describe('/PUT /api/photos/:id', () => {
    const nonExistentPhotoId = new mongoose.Types.ObjectId();
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).put(`/api/photos/${nonExistentPhotoId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authenticated');
    });

    it('should return 404 if photo is not found', async () => {
        const response = await request(app)
            .put(`/api/photos/${nonExistentPhotoId}`)
            .set('Cookie', [`access_token=${token}`]);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Photo not found');
    });

    it('should return 403 if user is not the owner of the photo', async () => {
        await request(app).post('/api/auth/sign-up').send({
            name: 'Steve Jobs',
            username: 'stevejobs',
            email: 'stevejobs@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        const response = await request(app).post('/api/auth/sign-in').send({
            username: 'stevejobs',
            password: 'password',
        });

        const cookie = response.header['set-cookie'];
        const token2 = cookie[0].split('access_token=')[1].split(';')[0];

        const photoResponse = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token2}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
            });

        const response2 = await request(app)
            .put(`/api/photos/${photoResponse.body._id}`)
            .set('Cookie', [`access_token=${token}`])
            .send({ title: 'New title' });

        expect(response2.status).toBe(403);
        expect(response2.body.message).toBe('You can only update your own photos');
    });

    it('should return 200 if photo is found and user is the owner', async () => {
        const photoResponse = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
                title:"old photo"
            });

        const response = await request(app)
            .put(`/api/photos/${photoResponse.body._id}`)
            .set('Cookie', [`access_token=${token}`])
            .send({ title: 'New title' });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('New title');
    });


});

describe('DELETE /api/photos/:id', () => {
    const nonExistentPhotoId = new mongoose.Types.ObjectId();
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).delete(`/api/photos/${nonExistentPhotoId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authenticated');
    });

    it('should return 404 if photo is not found', async () => {
        const response = await request(app)
            .delete(`/api/photos/${nonExistentPhotoId}`)
            .set('Cookie', [`access_token=${token}`]);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Photo not found');
    });

    it('should return 403 if user is not the owner of the photo', async () => {
        await request(app).post('/api/auth/sign-up').send({
            name: 'Steve Jobs',
            username: 'stevejobs',
            email: 'stevejobs@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        const response = await request(app).post('/api/auth/sign-in').send({
            username: 'stevejobs',
            password: 'password',
        });

        const cookie = response.header['set-cookie'];
        const token2 = cookie[0].split('access_token=')[1].split(';')[0];

        const photoResponse = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token2}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
            });

        const response2 = await request(app)
            .delete(`/api/photos/${photoResponse.body._id}`)
            .set('Cookie', [`access_token=${token}`])

        expect(response2.status).toBe(403);
        expect(response2.body.message).toBe('You can only delete your own photos');
    });

    it('should return 204 if photo is found and user is the owner', async () => {
        const photoResponse = await request(app)
            .post('/api/photos/create')
            .set('Cookie', [`access_token=${token}`])
            .send({
                image_url: 'https://www.example.com/image.jpg',
            });

        const response = await request(app)
            .delete(`/api/photos/${photoResponse.body._id}`)
            .set('Cookie', [`access_token=${token}`]);

        expect(response.status).toBe(204);
    });
});
