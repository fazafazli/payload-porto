// lib/payload.js
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

class PayloadAPI {
  constructor() {
    this.baseURL = PAYLOAD_API_URL;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payload API Error:', error);
      throw error;
    }
  }

  // Get all items from a collection
  async getCollection(collection, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/${collection}${queryString ? `?${queryString}` : ''}`;
    return this.fetch(endpoint);
  }

  // Get single item by ID
  async getItem(collection, id) {
    return this.fetch(`/${collection}/${id}`);
  }

  // Get single item by slug
  async getBySlug(collection, slug) {
    const data = await this.fetch(`/${collection}?where[slug][equals]=${slug}`);
    return data.docs?.[0] || null;
  }

  // Create new item (requires authentication)
  async createItem(collection, data, token) {
    return this.fetch(`/${collection}`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Update item (requires authentication)
  async updateItem(collection, id, data, token) {
    return this.fetch(`/${collection}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Delete item (requires authentication)
  async deleteItem(collection, id, token) {
    return this.fetch(`/${collection}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  }

  // Authentication
  async login(email, password) {
    return this.fetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(token) {
    return this.fetch('/users/logout', {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  }

  async me(token) {
    return this.fetch('/users/me', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  }
}

export const payloadAPI = new PayloadAPI();

// Helper functions for common operations
export async function getProjects() {
  return payloadAPI.getCollection('projects', { 
    limit: 100,
    sort: '-createdAt'
  });
}

export async function getProject(slug) {
  return payloadAPI.getBySlug('projects', slug);
}

export async function getExperiences() {
  return payloadAPI.getCollection('experiences', { 
    limit: 100,
    sort: '-startDate'
  });
}

export async function getSkills() {
  return payloadAPI.getCollection('skills', { 
    limit: 100,
    sort: 'order'
  });
}