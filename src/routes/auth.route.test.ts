import request from 'supertest';
import { app } from '../server';
import { connect, closeDatabase, clearDatabase } from '../utils/dbHandler';

// beforeAll(async () => await connect());
// afterEach(async () => await clearDatabase());
// afterAll(async () => await closeDatabase());

describe('/POST signup', () => {
    it('should return 400 when all required fields are not filled', async () => {
        await request(app)
            .post('/api/auth/sign-up')
            .send({
                name: 'Elon Musk',
                email: 'elonmusk@email.com',
                password: 'password',
                confirmPassword: 'password',
            })
            .expect(400);
    });

    it('should return 201 when user is created', async () => {
        await request(app)
            .post('/api/auth/sign-up')
            .send({
                name: 'Elon Musk',
                username: 'elonmusk',
                email: 'elonmusk@email.com',
                password: 'password',
                confirmPassword: 'password',
            })
            .expect(201);
    });

    it('should return 400 when user already exists', async () => {
        await request(app)
            .post('/api/auth/sign-up')
            .send({
                name: 'Elon Musk',
                username: 'elonmusk',
                email: 'elonmusk@email.com',
                password: 'password',
                confirmPassword: 'password',
            })
            .expect(400);
    });

    it('should return 400 when password does not match', async () => {
        await request(app)
            .post('/api/auth/sign-up')
            .send({
                name: 'Elon Musk',
                username: 'elonmusk',
                email: 'elonmusk@email.com',
                password: 'passwordd',
                confirmPassword: 'password',
            })
            .expect(400);
    });
});

describe('/POST signin', () => {
    it('should return 400 when all required fields are not filled', async () => {
        await request(app)
            .post('/api/auth/sign-in')
            .send({
                email: 'elonmusk@email.com',
            })
            .expect(400);
    });

    it('should return 400 when user does not exist', async () => {
        await request(app)
            .post('/api/auth/sign-in')
            .send({
                email: 'musk@email.com',
                password: 'password',
            })
            .expect(400);
    });

    it('should return 400 when password is incorrect', async () => {
        await request(app)
            .post('/api/auth/sign-in')
            .send({
                email: 'elonmusk@email.com',
                password: 'passwordd',
            })
            .expect(400);
    });

    it('should return 200 when user signs in', async () => {
        await request(app)
            .post('/api/auth/sign-in')
            .send({
                email: 'elonmusk@email.com',
                password: 'password',
            })
            .expect(200);
    });
});

describe('/POST google', () => {
    it('should return 422 when all required fields are not filled', async () => {
        await request(app)
            .post('/api/auth/google')
            .send({
                name: 'Elon Musk',
            })
            .expect(422);
    });

    it('should return 201 when user signs up with google', async () => {
        await request(app)
            .post('/api/auth/google')
            .send({
                name: 'Elon Musk',
                email: 'elonmuskoficial@email.com',
                avatarUrl: 'https://avatar.com',
            })
            .expect(201);
    });

    it('should return 200 when user signs in with google', async () => {
        await request(app)
            .post('/api/auth/google')
            .send({
                name: 'Elon Musk',
                email: 'elonmuskoficial@email.com',
            })
            .expect(200);
    });
});

describe('/POST signout', () => {
    it('should return 200 when user signs out', async () => {
        await request(app).post('/api/auth/sign-out').expect(200);
    });
});
