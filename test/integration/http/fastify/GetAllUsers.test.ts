import axios, { AxiosError } from 'axios';

describe('GET /v1/users integration test', () => {
  let accessToken: string;

  const adminUser = {
    email: `admin@example.com`,
    password: 'aVeryStrongPassword123',
  };

  beforeAll(async () => {
    const loginResponse = await axios.post('http://localhost:3001/v1/login', {
      email: adminUser.email,
      password: adminUser.password,
    });
    accessToken = loginResponse.data.accessToken;
  }, 30000);

  test('Should return 401 Unauthorized if no token is provided', async () => {
    try {
      await axios.get('http://localhost:3001/v1/users');
      fail('Request should have failed with 401, but it succeeded.');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(401);
    }
  });

  test('Should return all users when authenticated as admin', async () => {
    const response = await axios.get('http://localhost:3001/v1/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.paginatedOutput.users).toBeInstanceOf(Array);
    const foundUser = response.data.paginatedOutput.users.find(
      (user: any) => user.email === adminUser.email,
    );
    expect(foundUser).toBeDefined();
  });
});
