import axios from 'axios';

describe('Get all users route test', () => {
    test('Should return all users', async () => {
        const users = await axios.get('http://localhost:3000/users');

        expect(users).toBeDefined();
    });
});
