import { auth } from '@/auth';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = SERVER_URL) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders() {
    const session = await auth();

    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    // Create a base64 encoded user object for the Authorization header
    const userPayload = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
    };

    const encodedUser = Buffer.from(JSON.stringify(userPayload)).toString('base64');

    return {
      'Authorization': `Bearer ${encodedUser}`,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint: string) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// Client-side API utility for use in components
export class ClientApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = SERVER_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(user: any) {
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Create a base64 encoded user object for the Authorization header
    const userPayload = {
      id: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const encodedUser = btoa(JSON.stringify(userPayload));

    return {
      'Authorization': `Bearer ${encodedUser}`,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint: string, user: any) {
    const headers = this.getAuthHeaders(user);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async post(endpoint: string, data: any, user: any) {
    const headers = this.getAuthHeaders(user);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async put(endpoint: string, data: any, user: any) {
    const headers = this.getAuthHeaders(user);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(endpoint: string, user: any) {
    const headers = this.getAuthHeaders(user);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const clientApiClient = new ClientApiClient();