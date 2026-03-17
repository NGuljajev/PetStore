/**
 * Test data for API testing
 */

const petCreatePayload = {
  id: 999001,
  category: {
    id: 1,
    name: 'Dogs'
  },
  name: 'Testable Dog',
  photoUrls: [
    'https://example.com/photo1.jpg'
  ],
  tags: [
    {
      id: 1,
      name: 'test'
    }
  ],
  status: 'available'
};

const petUpdatePayload = {
  id: 999001,
  name: 'Updated Dog',
  status: 'sold'
};

const userCreatePayload = {
  id: 10001,
  username: 'testuser123',
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'TestPassword123',
  phone: '1234567890',
  userStatus: 0
};

const orderCreatePayload = {
  id: 99001,
  petId: 999001,
  quantity: 2,
  shipDate: new Date().toISOString(),
  status: 'placed',
  complete: false
};

const invalidPetPayload = {
  // Missing required fields like name, photoUrls
  id: 999002,
  category: {}
};

module.exports = {
  petCreatePayload,
  petUpdatePayload,
  userCreatePayload,
  orderCreatePayload,
  invalidPetPayload
};
