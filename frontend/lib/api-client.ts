import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/api/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    return access_token;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Vehicle API
export const vehicleAPI = {
  getVehicles: async () => {
    const response = await apiClient.get('/api/vehicles');
    return response.data;
  },
  
  getVehicle: async (id: string) => {
    const response = await apiClient.get(`/api/vehicles/${id}`);
    return response.data;
  },
  
  addVehicle: async (vehicleData: {
    make: string;
    model: string;
    year: number;
    type: string;
    vin?: string;
    mileage?: number;
  }) => {
    const response = await apiClient.post('/api/vehicles', vehicleData);
    return response.data;
  },
  
  updateVehicle: async (id: string, vehicleData: any) => {
    const response = await apiClient.put(`/api/vehicles/${id}`, vehicleData);
    return response.data;
  },
  
  deleteVehicle: async (id: string) => {
    const response = await apiClient.delete(`/api/vehicles/${id}`);
    return response.data;
  },
};

// Diagnostics API
export const diagnosticsAPI = {
  diagnoseIssue: async (data: {
    vehicle_id: string;
    issue_description: string;
    obd_codes?: string[];
  }) => {
    const response = await apiClient.post('/api/diagnostics', data);
    return response.data;
  },
  
  getRepairGuide: async (issueId: string, vehicleId: string) => {
    const response = await apiClient.get(`/api/diagnostics/repair-guide/${issueId}?vehicle_id=${vehicleId}`);
    return response.data;
  },
};

export default apiClient;