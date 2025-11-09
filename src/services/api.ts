import axios from 'axios';
import type { TripRequest, TripRequestResponse } from '../types/trip';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tripApi = {
  createTripRequest: async (data: TripRequest): Promise<TripRequestResponse> => {
    const response = await apiClient.post<TripRequestResponse>('/trip/request', data);
    return response.data;
  },
  
  getItinerary: async (id: string) => {
    const response = await apiClient.get(`/trip/${id}`);
    return response.data;
  },
  
  getAllItineraries: async () => {
    const response = await apiClient.get('/trip/all');
    return response.data;
  },
};

