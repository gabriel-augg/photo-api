import request from 'supertest';
import { app } from '../../server';
import mongoose from 'mongoose';

let token: string;
let userId: mongoose.Types.ObjectId;

beforeEach(async () => {
    await request(app).post('/api/auth/sign-up').send({
        name: 'Elon Musk',
        username: 'elonmusk55',
        email: 'elonmusk55@email.com',
        password: 'password',
        confirmPassword: 'password',
    });

    const response = await request(app).post('/api/auth/sign-in').send({
        email: 'elonmusk55@email.com',
        password: 'password',
    });

    userId = response.body._id;
    const cookie = response.header['set-cookie'];
    token = cookie[0].split('access_token=')[1].split(';')[0];
});

describe('/GET /api/users/:id', () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    it('should return 404 when user is not found', async () => {
        const response = await request(app).get(`/api/users/${nonExistentUserId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 200 when user is found', async () => {
        const response = await request(app).get(`/api/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('elonmusk55');
    });
});

describe('/DELETE /api/users/:id/delete', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).delete(`/api/users/${userId}/delete`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authenticated');
    });

    it('should return 403 if trying to delete another user', async () => {
        await request(app).post('/api/auth/sign-up').send({
            name: 'Jeff Bezos',
            username: 'jeffbezos',
            email: 'jeffbezzos@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        const anotherUser = await request(app).post('/api/auth/sign-in').send({
            email: 'jeffbezzos@email.com',
            password: 'password',
        });

        const response = await request(app)
            .delete(`/api/users/${anotherUser.body._id}/delete`)
            .set('Cookie', `access_token=${token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You can only delete your own account');
    });

    it('should return 200 when user is deleted', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}/delete`)
            .set('Cookie', `access_token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
});
