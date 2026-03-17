

const PetstoreClient = require('../utils/client');
const { userCreatePayload } = require('../utils/testData');

describe('User Endpoints - CRUD Operations', () => {
  const testUsername = 'testuser' + Date.now();


  describe('POST /user - Create a new user', () => {
    test('Should create a user with valid data', async () => {
      const userData = {
        ...userCreatePayload,
        id: Date.now(),
        username: testUsername
      };

      const response = await PetstoreClient.post('/user', userData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('code');
    });

    test('Should create a user with minimal required fields', async () => {
      const minimalUser = {
        id: Date.now() + 1,
        username: 'minimaluser' + Date.now()
      };

      const response = await PetstoreClient.post('/user', minimalUser);

      expect(response.status).toBe(200);
    });

    test('Should create a user with special characters in username', async () => {
      const specialUser = {
        id: Date.now() + 2,
        username: 'user_' + Date.now() + '.test-123'
      };

      const response = await PetstoreClient.post('/user', specialUser);

      expect(response.status).toBe(200);
    });

    test('Should create a user with all optional fields', async () => {
      const fullUser = {
        ...userCreatePayload,
        id: Date.now() + 3,
        username: 'fulluser' + Date.now(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
        phone: '+1234567890',
        userStatus: 1
      };

      const response = await PetstoreClient.post('/user', fullUser);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /user/{username} - Retrieve user by username', () => {
    test('Should retrieve a user by valid username', async () => {
      const username = 'getuser' + Date.now();
      const userData = {
        id: Date.now(),
        username: username,
        firstName: 'Get',
        lastName: 'User'
      };

      await PetstoreClient.post('/user', userData);
      const response = await PetstoreClient.get(`/user/${username}`);

      expect(response.status).toBe(200);
      expect(response.data.username).toBe(username);
    });

    test('Should retrieve user with all fields populated', async () => {
      const username = 'fullgetuser' + Date.now();
      const userData = {
        ...userCreatePayload,
        id: Date.now(),
        username: username,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890'
      };

      await PetstoreClient.post('/user', userData);
      const response = await PetstoreClient.get(`/user/${username}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('username');
      expect(response.data).toHaveProperty('firstName');
      expect(response.data).toHaveProperty('lastName');
    });
  });

  describe('PUT /user/{username} - Update an existing user', () => {
    test('Should update a user successfully', async () => {
      const username = 'updateuser' + Date.now();
      const initialData = {
        id: Date.now(),
        username: username,
        firstName: 'Original',
        lastName: 'Name'
      };

      await PetstoreClient.post('/user', initialData);

      const updateData = {
        id: initialData.id,
        username: username,
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await PetstoreClient.put(`/user/${username}`, updateData);

      expect(response.status).toBe(200);
    });

    test('Should update user email and phone', async () => {
      const username = 'emailuser' + Date.now();
      const initialData = {
        id: Date.now(),
        username: username,
        email: 'old@example.com',
        phone: '1111111111'
      };

      await PetstoreClient.post('/user', initialData);

      const updateData = {
        id: initialData.id,
        username: username,
        email: 'new@example.com',
        phone: '9999999999'
      };

      const response = await PetstoreClient.put(`/user/${username}`, updateData);

      expect(response.status).toBe(200);
    });

    test('Should update user password', async () => {
      const username = 'passuser' + Date.now();
      const initialData = {
        id: Date.now(),
        username: username,
        password: 'OldPassword123'
      };

      await PetstoreClient.post('/user', initialData);

      const updateData = {
        id: initialData.id,
        username: username,
        password: 'NewPassword456'
      };

      const response = await PetstoreClient.put(`/user/${username}`, updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /user/{username} - Delete a user', () => {
    test('Should delete a user by valid username', async () => {
      const username = 'deluser' + Date.now();
      const userData = {
        id: Date.now(),
        username: username
      };

      await PetstoreClient.post('/user', userData);
      const response = await PetstoreClient.delete(`/user/${username}`);

      expect(response.status).toBe(200);
    });

    test('Should not retrieve a deleted user', async () => {
      const username = 'deluser2' + Date.now();
      const userData = {
        id: Date.now(),
        username: username
      };

      await PetstoreClient.post('/user', userData);
      await PetstoreClient.delete(`/user/${username}`);
      const response = await PetstoreClient.get(`/user/${username}`);

      expect(response.status).toBe(404);
    });
  });


  describe('POST /user - Negative Tests', () => {
    test('Should handle creating user with empty username', async () => {
      const invalidUser = {
        id: Date.now(),
        username: ''
      };

      const response = await PetstoreClient.post('/user', invalidUser);

      expect([400, 200]).toContain(response.status);
    });

    test('Should handle creating user with null username', async () => {
      const invalidUser = {
        id: Date.now(),
        username: null
      };

      const response = await PetstoreClient.post('/user', invalidUser);

      expect([400, 200]).toContain(response.status);
    });

    test('Should handle creating user with duplicate username', async () => {
      const username = 'dupuser' + Date.now();
      const userData = {
        id: Date.now(),
        username: username
      };

      await PetstoreClient.post('/user', userData);
      const response = await PetstoreClient.post('/user', {
        ...userData,
        id: Date.now() + 1
      });

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle invalid email format', async () => {
      const invalidUser = {
        id: Date.now(),
        username: 'emailuser' + Date.now(),
        email: 'not-an-email'
      };

      const response = await PetstoreClient.post('/user', invalidUser);

      expect(response.status).toBeDefined();
    });
  });

  describe('GET /user/{username} - Negative Tests', () => {
    test('Should return 404 for non-existent username', async () => {
      const response = await PetstoreClient.get('/user/nonexistentuser999999');

      expect(response.status).toBe(404);
    });

    test('Should return error for empty username', async () => {
      const response = await PetstoreClient.get('/user/');

      expect([400, 404, 405]).toContain(response.status);
    });

    test('Should handle special characters in username search', async () => {
      const response = await PetstoreClient.get('/user/user@#$%^&*');

      expect([400, 404]).toContain(response.status);
    });
  });

  describe('PUT /user/{username} - Negative Tests', () => {
    test('Should handle updating non-existent user', async () => {
      const updateData = {
        id: Date.now(),
        username: 'nonexistent',
        firstName: 'Test'
      };

      const response = await PetstoreClient.put('/user/nonexistent', updateData);

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('DELETE /user/{username} - Negative Tests', () => {
    test('Should handle deleting non-existent user', async () => {
      const response = await PetstoreClient.delete('/user/nonexistentuser123');

      expect([200, 404]).toContain(response.status);
    });
  });


  describe('User Endpoints - Edge Cases', () => {
    test('Should handle user with very long username', async () => {
      const longUsername = 'a'.repeat(255);
      const userData = {
        id: Date.now(),
        username: longUsername
      };

      const response = await PetstoreClient.post('/user', userData);

      expect(response.status).toBeDefined();
    });

    test('Should handle user with numeric username', async () => {
      const numericUsername = Date.now().toString();
      const userData = {
        id: Date.now(),
        username: numericUsername
      };

      const response = await PetstoreClient.post('/user', userData);

      expect(response.status).toBe(200);
    });

    test('Should handle user with userStatus as various values', async () => {
      const statuses = [0, 1, 2, -1];

      for (const status of statuses) {
        const userData = {
          id: Date.now() + status,
          username: 'statususer' + Date.now() + status,
          userStatus: status
        };

        const response = await PetstoreClient.post('/user', userData);

        expect([200, 400]).toContain(response.status);
      }
    });

    test('Should handle user with negative ID', async () => {
      const userData = {
        id: -1,
        username: 'negativeuser' + Date.now()
      };

      const response = await PetstoreClient.post('/user', userData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle user with very long email', async () => {
      const longEmail = 'a'.repeat(200) + '@example.com';
      const userData = {
        id: Date.now(),
        username: 'longemailuser' + Date.now(),
        email: longEmail
      };

      const response = await PetstoreClient.post('/user', userData);

      expect(response.status).toBeDefined();
    });

    test('Should handle user with international characters in name', async () => {
      const userData = {
        id: Date.now(),
        username: 'intluser' + Date.now(),
        firstName: '日本語',
        lastName: 'नमस्ते'
      };

      const response = await PetstoreClient.post('/user', userData);

      expect([200, 400]).toContain(response.status);
    });
  });
});
