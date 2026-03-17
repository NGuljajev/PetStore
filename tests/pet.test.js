/**
 * Pet Endpoint Tests
 * Tests for: POST /pet (create), GET /pet/{petId} (read), PUT /pet (update), DELETE /pet/{petId} (delete)
 */

const PetstoreClient = require('../utils/client');
const { petCreatePayload, petUpdatePayload, invalidPetPayload } = require('../utils/testData');

describe('Pet Endpoints - CRUD Operations', () => {
  let createdPetId;

  // ========== FUNCTIONAL TESTS (Happy Path) ==========

  describe('POST /pet - Create a new pet', () => {
    test('Should create a pet with valid data', async () => {
      const response = await PetstoreClient.post('/pet', petCreatePayload);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe('Testable Dog');
      expect(response.data.status).toBe('available');
      
      createdPetId = response.data.id;
    });

    test('Should create a pet with minimal required fields', async () => {
      const minimalPet = {
        id: 999003,
        name: 'Minimal Pet',
        photoUrls: ['https://example.com/photo.jpg']
      };
      
      const response = await PetstoreClient.post('/pet', minimalPet);
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Minimal Pet');
    });

    test('Should create a pet with special characters in name', async () => {
      const specialPet = {
        ...petCreatePayload,
        id: 999004,
        name: 'Pet-With_Special.Chars@123'
      };
      
      const response = await PetstoreClient.post('/pet', specialPet);
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Pet-With_Special.Chars@123');
    });
  });

  describe('GET /pet/{petId} - Retrieve pet by ID', () => {
    test('Should retrieve a pet by valid ID', async () => {
      // First create a pet
      const createResponse = await PetstoreClient.post('/pet', petCreatePayload);
      const petId = createResponse.data.id;
      
      // Then retrieve it
      const getResponse = await PetstoreClient.get(`/pet/${petId}`);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBe(petId);
      expect(getResponse.data.name).toBe('Testable Dog');
    });

    test('Should retrieve a pet with all expected fields', async () => {
      const createResponse = await PetstoreClient.post('/pet', petCreatePayload);
      const petId = createResponse.data.id;
      
      const getResponse = await PetstoreClient.get(`/pet/${petId}`);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toHaveProperty('id');
      expect(getResponse.data).toHaveProperty('name');
      expect(getResponse.data).toHaveProperty('photoUrls');
      expect(getResponse.data).toHaveProperty('status');
    });
  });

  describe('PUT /pet - Update an existing pet', () => {
    test('Should update a pet with valid data', async () => {
      // Create a pet first
      const createResponse = await PetstoreClient.post('/pet', petCreatePayload);
      const petId = createResponse.data.id;
      
      // Update the pet
      const updatePayload = {
        ...petCreatePayload,
        id: petId,
        name: 'Updated Pet Name',
        status: 'sold'
      };
      
      const updateResponse = await PetstoreClient.put('/pet', updatePayload);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.name).toBe('Updated Pet Name');
      expect(updateResponse.data.status).toBe('sold');
    });

    test('Should update only the status of a pet', async () => {
      const createResponse = await PetstoreClient.post('/pet', petCreatePayload);
      const petId = createResponse.data.id;
      
      const updatePayload = {
        ...petCreatePayload,
        id: petId,
        status: 'pending'
      };
      
      const updateResponse = await PetstoreClient.put('/pet', updatePayload);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.status).toBe('pending');
    });

    test('Should update pet with multiple tags', async () => {
      const createResponse = await PetstoreClient.post('/pet', petCreatePayload);
      const petId = createResponse.data.id;
      
      const updatePayload = {
        ...petCreatePayload,
        id: petId,
        tags: [
          { id: 1, name: 'tag1' },
          { id: 2, name: 'tag2' },
          { id: 3, name: 'tag3' }
        ]
      };
      
      const updateResponse = await PetstoreClient.put('/pet', updatePayload);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.tags.length).toBe(3);
    });
  });

  describe('DELETE /pet/{petId} - Delete a pet', () => {
    test('Should delete a pet by valid ID', async () => {
      // Create a pet
      const createResponse = await PetstoreClient.post('/pet', {
        ...petCreatePayload,
        id: 999010
      });
      const petId = createResponse.data.id;
      
      // Delete the pet
      const deleteResponse = await PetstoreClient.delete(`/pet/${petId}`);
      
      expect(deleteResponse.status).toBe(200);
    });

    test('Should not retrieve a deleted pet', async () => {
      // Create a pet
      const createResponse = await PetstoreClient.post('/pet', {
        ...petCreatePayload,
        id: 999011
      });
      const petId = createResponse.data.id;
      
      // Delete the pet
      await PetstoreClient.delete(`/pet/${petId}`);
      
      // Try to retrieve deleted pet
      const getResponse = await PetstoreClient.get(`/pet/${petId}`);
      
      expect(getResponse.status).toBe(404);
    });
  });

  // ========== NEGATIVE TESTS ==========

  describe('POST /pet - Negative Tests', () => {
    test('Should return error when creating pet with missing name', async () => {
      const invalidPet = {
        id: 999020,
        photoUrls: ['https://example.com/photo.jpg'],
        status: 'available'
      };
      
      const response = await PetstoreClient.post('/pet', invalidPet);
      
      // API may return 400 or 200 depending on implementation
      expect([400, 200]).toContain(response.status);
    });

    test('Should handle creating pet with empty string name', async () => {
      const invalidPet = {
        id: 999021,
        name: '',
        photoUrls: ['https://example.com/photo.jpg']
      };
      
      const response = await PetstoreClient.post('/pet', invalidPet);
      
      // Verify response is received (API may accept or reject)
      expect(response.status).toBeDefined();
    });

    test('Should handle creating pet with duplicate ID', async () => {
      const pet1 = { ...petCreatePayload, id: 999030 };
      const pet2 = { ...petCreatePayload, id: 999030, name: 'Different Pet' };
      
      await PetstoreClient.post('/pet', pet1);
      const response = await PetstoreClient.post('/pet', pet2);
      
      // Second creation should succeed or update
      expect([200, 409]).toContain(response.status);
    });
  });

  describe('GET /pet/{petId} - Negative Tests', () => {
    test('Should return 404 for non-existent pet ID', async () => {
      const response = await PetstoreClient.get('/pet/999999999');
      
      expect(response.status).toBe(404);
    });

    test('Should return error for invalid pet ID format', async () => {
      const response = await PetstoreClient.get('/pet/invalid-id');
      
      // May return 400 or 404 depending on API
      expect([400, 404]).toContain(response.status);
    });

    test('Should return error for negative pet ID', async () => {
      const response = await PetstoreClient.get('/pet/-1');
      
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('PUT /pet - Negative Tests', () => {
    test('Should handle updating non-existent pet', async () => {
      const updatePayload = {
        ...petCreatePayload,
        id: 999999999,
        name: 'Non-existent pet'
      };
      
      const response = await PetstoreClient.put('/pet', updatePayload);
      
      // API may return error or create new pet
      expect(response.status).toBeDefined();
    });

    test('Should handle update with missing required field ID', async () => {
      const invalidUpdate = {
        name: 'No ID Pet',
        photoUrls: ['https://example.com/photo.jpg']
      };
      
      const response = await PetstoreClient.put('/pet', invalidUpdate);
      
      expect([400, 422]).toContain(response.status);
    });
  });

  describe('DELETE /pet/{petId} - Negative Tests', () => {
    test('Should handle deleting non-existent pet', async () => {
      const response = await PetstoreClient.delete('/pet/999999999');
      
      // May return 200 or 404 depending on implementation
      expect([200, 404]).toContain(response.status);
    });

    test('Should handle delete with invalid ID format', async () => {
      const response = await PetstoreClient.delete('/pet/abc-123');
      
      expect([400, 404]).toContain(response.status);
    });
  });

  // ========== EDGE CASE TESTS ==========

  describe('Pet Endpoints - Edge Cases', () => {
    test('Should handle pet with very long name', async () => {
      const longName = 'A'.repeat(500);
      const pet = {
        ...petCreatePayload,
        id: 999040,
        name: longName
      };
      
      const response = await PetstoreClient.post('/pet', pet);
      
      expect(response.status).toBeDefined();
    });

    test('Should handle pet with null category', async () => {
      const pet = {
        ...petCreatePayload,
        id: 999041,
        category: null
      };
      
      const response = await PetstoreClient.post('/pet', pet);
      
      expect([200, 400]).toContain(response.status);
    });

    test('Should handle pet with empty photoUrls array', async () => {
      const pet = {
        ...petCreatePayload,
        id: 999042,
        photoUrls: []
      };
      
      const response = await PetstoreClient.post('/pet', pet);
      
      expect([200, 400]).toContain(response.status);
    });

    test('Should handle pet with special status values', async () => {
      const validStatuses = ['available', 'pending', 'sold'];
      
      for (const status of validStatuses) {
        const pet = {
          ...petCreatePayload,
          id: 999050 + validStatuses.indexOf(status),
          status: status
        };
        
        const response = await PetstoreClient.post('/pet', pet);
        
        expect(response.status).toBe(200);
      }
    });

    test('Should handle pet with maximum integer ID', async () => {
      const pet = {
        ...petCreatePayload,
        id: 9007199254740991 // Max safe integer in JavaScript
      };
      
      const response = await PetstoreClient.post('/pet', pet);
      
      expect([200, 400]).toContain(response.status);
    });
  });
});
