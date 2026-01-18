import axios from 'axios';
import { CaseData, Case, RecommendationRequest, RecommendationResponse } from './types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const createCase = async (caseData: CaseData): Promise<Case> => {
  const response = await api.post('/create_case', caseData);
  return response.data;
};

export const getRecommendations = async (
  request: RecommendationRequest
): Promise<RecommendationResponse> => {
  const response = await api.post('/recommend_icm', request);
  return response.data;
};

export const getCases = async (limit = 100, offset = 0): Promise<Case[]> => {
  const response = await api.get('/cases', { params: { limit, offset } });
  return response.data;
};

export const getCase = async (caseId: number): Promise<Case> => {
  const response = await api.get(`/cases/${caseId}`);
  return response.data;
};
