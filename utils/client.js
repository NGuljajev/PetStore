const axios = require('axios');

const BASE_URL = 'https://petstore.swagger.io/v2';

/**
 * API client for making requests to Petstore API
 */
class PetstoreClient {
  /**
   * Make a GET request
   */
  static async get(endpoint) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  /**
   * Make a POST request
   */
  static async post(endpoint, data) {
    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  /**
   * Make a PUT request
   */
  static async put(endpoint, data) {
    try {
      const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  /**
   * Make a DELETE request
   */
  static async delete(endpoint) {
    try {
      const response = await axios.delete(`${BASE_URL}${endpoint}`);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

module.exports = PetstoreClient;
