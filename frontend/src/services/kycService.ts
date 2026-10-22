import api from './api';
import type { ApiResponse } from '../types/api';

export const kycService = {
  async submitDocuments(formData: FormData): Promise<ApiResponse<{ inquiryId: string }>> {
    const { data } = await api.post('/kyc/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getKYCStatus(): Promise<ApiResponse<{ status: string; updatedAt: string }>> {
    const { data } = await api.get('/kyc/status');
    return data;
  },
};
