const PetstoreClient = require('../utils/client');

describe('Store Endpoints', () => {
  describe('GET /store/inventory - Get pet inventory', () => {
    test('Should return store inventory', async () => {
      const response = await PetstoreClient.get('/store/inventory');
      
      expect(response.status).toBe(200);
      expect(typeof response.data).toBe('object');
    });

    test('Should return inventory with status keys', async () => {
      const response = await PetstoreClient.get('/store/inventory');
      
      expect(response.status).toBe(200);
      const validStatuses = ['available', 'pending', 'sold'];
      const hasStatusKey = validStatuses.some(status => status in response.data);
      expect(hasStatusKey).toBe(true);
    });

    test('Should return inventory with numeric values', async () => {
      const response = await PetstoreClient.get('/store/inventory');
      
      expect(response.status).toBe(200);
      Object.values(response.data).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });
  });

  describe('POST /store/order - Create a store order', () => {
    test('Should create an order with valid data', async () => {
      const orderData = {
        id: Date.now(),
        petId: 1,
        quantity: 2,
        shipDate: new Date().toISOString(),
        status: 'placed',
        complete: false
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
    });

    test('Should create order with minimal fields', async () => {
      const orderData = {
        id: Date.now() + 1,
        petId: 1,
        quantity: 1
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect(response.status).toBe(200);
    });

    test('Should create order with different status values', async () => {
      const statuses = ['placed', 'approved', 'delivered'];
      
      for (const status of statuses) {
        const orderData = {
          id: Date.now() + statuses.indexOf(status),
          petId: 1,
          quantity: 1,
          status: status
        };

        const response = await PetstoreClient.post('/store/order', orderData);

        expect([200, 400]).toContain(response.status);
      }
    });

    test('Should create order with quantity variations', async () => {
      const quantities = [1, 5, 100];
      
      for (const qty of quantities) {
        const orderData = {
          id: Date.now() + qty,
          petId: 1,
          quantity: qty
        };

        const response = await PetstoreClient.post('/store/order', orderData);

        expect(response.status).toBe(200);
      }
    });

    test('Should handle order with future ship date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const orderData = {
        id: Date.now() + 1000,
        petId: 1,
        quantity: 1,
        shipDate: futureDate.toISOString(),
        status: 'placed'
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /store/order/{orderId} - Get order by ID', () => {
    test('Should retrieve an order by valid ID', async () => {
      const orderId = Date.now();
      const orderData = {
        id: orderId,
        petId: 1,
        quantity: 1,
        status: 'placed'
      };

      await PetstoreClient.post('/store/order', orderData);
      const response = await PetstoreClient.get(`/store/order/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(orderId);
    });

    test('Should return all order fields', async () => {
      const orderId = Date.now() + 1;
      const orderData = {
        id: orderId,
        petId: 5,
        quantity: 3,
        status: 'approved',
        complete: true
      };

      await PetstoreClient.post('/store/order', orderData);
      const response = await PetstoreClient.get(`/store/order/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('petId');
      expect(response.data).toHaveProperty('quantity');
    });
  });

  describe('DELETE /store/order/{orderId} - Delete order', () => {
    test('Should delete an order by valid ID', async () => {
      const orderId = Date.now() + 2;
      const orderData = {
        id: orderId,
        petId: 1,
        quantity: 1
      };

      await PetstoreClient.post('/store/order', orderData);
      const response = await PetstoreClient.delete(`/store/order/${orderId}`);

      expect(response.status).toBe(200);
    });

    test('Should not retrieve deleted order', async () => {
      const orderId = Date.now() + 3;
      const orderData = {
        id: orderId,
        petId: 1,
        quantity: 1
      };

      await PetstoreClient.post('/store/order', orderData);
      await PetstoreClient.delete(`/store/order/${orderId}`);
      const getResponse = await PetstoreClient.get(`/store/order/${orderId}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Store Endpoints - Negative Tests', () => {
    test('Should handle POST order with negative quantity', async () => {
      const orderData = {
        id: Date.now() + 5000,
        petId: 1,
        quantity: -5
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle POST order with zero quantity', async () => {
      const orderData = {
        id: Date.now() + 5001,
        petId: 1,
        quantity: 0
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should return 404 for non-existent order ID', async () => {
      const response = await PetstoreClient.get('/store/order/999999999');

      expect(response.status).toBe(404);
    });

    test('Should handle invalid order ID format', async () => {
      const response = await PetstoreClient.get('/store/order/invalid-id');

      expect([400, 404]).toContain(response.status);
    });

    test('Should handle delete non-existent order', async () => {
      const response = await PetstoreClient.delete('/store/order/999999999');

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Store Endpoints - Edge Cases', () => {
    test('Should handle order with very large quantity', async () => {
      const orderData = {
        id: Date.now() + 6000,
        petId: 1,
        quantity: 999999
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle order with negative petId', async () => {
      const orderData = {
        id: Date.now() + 6001,
        petId: -1,
        quantity: 1
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle order with zero petId', async () => {
      const orderData = {
        id: Date.now() + 6002,
        petId: 0,
        quantity: 1
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle order with invalid status', async () => {
      const orderData = {
        id: Date.now() + 6003,
        petId: 1,
        quantity: 1,
        status: 'invalid_status'
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });

    test('Should handle order with maximum integer ID', async () => {
      const orderData = {
        id: 9007199254740991,
        petId: 1,
        quantity: 1
      };

      const response = await PetstoreClient.post('/store/order', orderData);

      expect([200, 400]).toContain(response.status);
    });
  });
});
