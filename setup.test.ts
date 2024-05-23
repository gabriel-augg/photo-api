// setup.test.ts
import { connect, closeDatabase, clearDatabase } from './src/utils/dbHandler';
import { server } from './src/server';

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
    if(server) {
        server.close();
    }
});
