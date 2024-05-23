import request from 'supertest';
import { app } from '../../server';

let user: any;

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

    user = response.body;
});

describe('/GET /api/users/:id', () => {
    it('should return 404 when user is not found', async () => {
        const response = await request(app).get('/api/users/664d2b64c52cf14f81ef88b6');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 200 when user is found', async () => {
        const response = await request(app).get(`/api/users/${user._id}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('elonmusk55');
    });
});

// describe('DELETE /deleteUser', () => {

//     it('should return 404 when user is not found', async () => {
//         const response = await request(app).delete('/api/users/664d2b64c52cf14f81ef88b6/delete');
//         expect(response.status).toBe(404);
//         expect(response.body.message).toBe('User not found');
//     });

//     it('should return 200 when user is deleted', async () => {
//         const response = await request(app).delete(`/api/users/${user._id}/delete`);

//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('User deleted successfully');
//     });
// });
