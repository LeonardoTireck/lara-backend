import axios from 'axios';

describe('/v1/health endpoint for checking application health', () => {
    test('Should return status code 200', async () => {
        const response = await axios.get('http://localhost:3001/v1/health');
        expect(response.status).toBe(200);
    });
});
