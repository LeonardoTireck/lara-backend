import axios from 'axios';

describe('Get all users from fastify route test', () => {
    test('Should return all users', async () => {
        const response = await axios.get('http://localhost:3001/users');
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });
});
