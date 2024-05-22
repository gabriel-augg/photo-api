import request from 'supertest';
import { app, server } from '../../server';
import { connect, closeDatabase, clearDatabase } from '../../utils/dbHandler';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('/POST signup', () => {
    it('should return 400 when all required fields are not filled', async () => {
        const response = await request(app).post('/api/auth/sign-up').send({
            name: 'Elon Musk',
            email: 'elonmusk@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please fill in all fields');
    });

    it('should return 201 when user is created', async () => {
        const response = await request(app).post('/api/auth/sign-up').send({
            name: 'Elon Musk',
            username: 'elonmusk',
            email: 'elonmusk@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
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
            .expect(201);

        const response = await request(app).post('/api/auth/sign-up').send({
            name: 'Elon Musk',
            username: 'elonmusk',
            email: 'elonmusk@email.com',
            password: 'password',
            confirmPassword: 'password',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username or email already in use');
    });

    it('should return 400 when password does not match', async () => {
        const response = await request(app).post('/api/auth/sign-up').send({
            name: 'Elon Musk',
            username: 'elonmusk',
            email: 'elonmusk@email.com',
            password: 'passwordd',
            confirmPassword: 'password',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Passwords do not match');
    });
});

describe('/POST signIn', () => {
    it('should return 400 when all required fields are not filled', async () => {
        const response = await request(app).post('/api/auth/sign-in').send({
            email: 'elonmusk@email.com',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please fill in all fields');
    });

    it('should return 400 when user does not exist', async () => {
        const response = await request(app).post('/api/auth/sign-in').send({
            email: 'musk@email.com',
            password: 'password',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 when password is incorrect', async () => {
        const response = await request(app).post('/api/auth/sign-in').send({
            email: 'elonmusk@email.com',
            password: 'passwordd',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 200 when user signs in', async () => {
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

        const response = await request(app).post('/api/auth/sign-in').send({
            email: 'elonmusk@email.com',
            password: 'password',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
    });
});

describe('/POST google', () => {
    it('should return 422 when all required fields are not filled', async () => {
        const response = await request(app).post('/api/auth/google').send({
            name: 'Elon Musk',
        });

        expect(response.status).toBe(422);
        expect(response.body.message).toBe("it was not possible to login with Google's account");
    });

    it('should return 201 when user signs up with google', async () => {
        const response = await request(app).post('/api/auth/google').send({
            name: 'Elon Musk',
            email: 'elonmusk@email.com',
            avatarUrl: 'https://avatar.com',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username');
    });

    it('should return 200 when user signs in with google', async () => {
        await request(app)
            .post('/api/auth/google')
            .send({
                name: 'Elon Musk',
                email: 'elonmusk@email.com',
                avatarUrl: 'https://avatar.com',
            })
            .expect(201);

        const response = await request(app).post('/api/auth/google').send({
            name: 'Elon Musk',
            email: 'elonmusk@email.com',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username');
    });
});

describe('/POST signOut', () => {
    it('should return 200 when user signs out', async () => {
        await request(app).post('/api/auth/sign-out').expect(200);
    });
});
