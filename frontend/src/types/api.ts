export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string;
  page?: number;
  limit?: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType =
  | 'KYC_COMPLETED'
  | 'LOAN_CREATED'
  | 'LOAN_APPROVED'
  | 'LOAN_FUNDED_PARTIAL'
  | 'LOAN_FULLY_FUNDED'
  | 'EMI_DUE_REMINDER'
  | 'EMI_PAID'
  | 'LOAN_DEFAULTED'
  | 'INVESTMENT_RETURN';
