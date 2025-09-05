import axios from 'axios';

describe('Fastify initial api test', () => {
    it('Should make a request to / and get a response', async () => {
        const response = await axios.get('http://localhost:3001/');
        console.log(response);
        expect(response.status).toBe(200);
        expect(response.data).toBe('Hello World');
    });
});
