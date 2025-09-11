import axios from 'axios';

describe('Create user route Test', () => {
  test('Should create a user using express and dynamodb', async () => {
    const input = {
      name: 'Leonardo Tireck',
      email: 'leo3@test.com',
      documentCPF: '987.654.321-00',
      phone: '+5547992000622',
      dateOfBirth: new Date(),
      password: 'Test123@',
      activePlan: {
        planType: 'silver',
        paymentMethod: 'card',
      },
    } as const;

    const outputHttpCreateUser = await axios.post(
      'http://localhost:3001/v1/newUser',
      input,
    );
    expect(outputHttpCreateUser.data.name).toBe(input.name);
    expect(outputHttpCreateUser.data.email).toBe(input.email);
  });
});
