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

describe('/PUT /api/users/:id/update', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).put(`/api/users/${userId}/update`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authenticated');
    });

    it('should return 403 if trying to update another user', async () => {
        await request(app).post('/api/auth/sign-up').send({
            name: 'Jeff Bezos',
            username: 'jeffbezos',
            email: 'jeffbezos@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        const anotherUser = await request(app).post('/api/auth/sign-in').send({
            email: 'jeffbezos@email.com',
            password: 'password',
        });

        const response = await request(app)
            .put(`/api/users/${anotherUser.body._id}/update`)
            .set('Cookie', `access_token=${token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You can only update your own account');
    });

    it('should return 400 when username or email field is empty', async () => {
        const response = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Elon Musk',
                email: 'elonmusk55@email.com',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username and email are required');
    });

    it('should return 404 when user is not found', async () => {
        await request(app).delete(`/api/users/${userId}/delete`).set('Cookie', `access_token=${token}`);

        const response = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Elon Musk',
                username: 'elonmusk55',
                email: 'elonmusk131@email.com',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 400 when username or email already exists', async () => {
        await request(app).post('/api/auth/sign-up').send({
            name: 'Jeff Bezos',
            username: 'jeffbezos',
            email: 'jeffbezos@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        const response = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Jeff Bezos',
                username: 'jeffbezos',
                email: 'elonmusk55@email.com',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username already in use');

        const response2 = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Jeff Bezos',
                username: 'jeffbezos2',
                email: 'jeffbezos@email.com',
            });

        expect(response2.status).toBe(400);
        expect(response2.body.message).toBe('Email already in use');
    });

    it('if password provided, should return 400 when passwords do not match', async () => {
        const response = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Elon Musk',
                username: 'elonmusk55',
                email: 'elonmusk55@email.com',
                password: 'password',
                confirmPassword: 'passwordd',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Passwords do not match');
    });

    it('should return 200 when user is updated', async () => {
        const response = await request(app)
            .put(`/api/users/${userId}/update`)
            .set('Cookie', `access_token=${token}`)
            .send({
                name: 'Elon Musk',
                username: 'XOwner',
                email: 'elonmusk55@email.com',
            });

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('XOwner');

        const response2 = await request(app).post('/api/auth/sign-in').send({
            username: 'XOwner',
            password: 'password',
        });

        expect(response2.status).toBe(200);
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
