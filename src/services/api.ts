// Construct API base URL - in Replit, replace port 5000 with 4000
const API_BASE = import.meta.env.VITE_API_BASE_URL || (() => {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(':5000', ':4000');
  }
  return 'http://localhost:4000';
})();

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      if (data.success && data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        return true;
      }

      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, requireAuth = true } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      let response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle token expiration
      if (response.status === 401 && requireAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          requestHeaders['Authorization'] = `Bearer ${this.getAuthToken()}`;
          response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
          });
        } else {
          this.clearTokens();
          window.location.href = '/login';
          return { success: false, error: 'Session expired', code: 'SESSION_EXPIRED' };
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  }

  // Auth endpoints
  async requestOTP(phone: string, purpose: 'LOGIN' | 'REGISTRATION') {
    return this.request('/api/v1/auth/otp/request', {
      method: 'POST',
      body: { phone, purpose },
      requireAuth: false,
    });
  }

  async register(data: { phone: string; name: string; email?: string; role?: string; otp: string }) {
    const response = await this.request<{
      user: { id: string; phone: string; name: string; email?: string; role: string };
      accessToken: string;
      refreshToken: string;
    }>('/api/v1/auth/register', {
      method: 'POST',
      body: data,
      requireAuth: false,
    });

    if (response.success && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async login(phone: string, otp: string) {
    const response = await this.request<{
      user: { id: string; phone: string; name: string; email?: string; role: string };
      accessToken: string;
      refreshToken: string;
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: { phone, otp },
      requireAuth: false,
    });

    if (response.success && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    const refreshToken = this.getRefreshToken();
    await this.request('/api/v1/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    });
    this.clearTokens();
  }

  async getProfile() {
    return this.request('/api/v1/auth/profile');
  }

  // Wallet endpoints
  async getWallet() {
    return this.request('/api/v1/wallet');
  }

  async getPaymentMethods() {
    return this.request('/api/v1/wallet/payment-methods');
  }

  async addPaymentMethod(data: { type: string; provider: string; accountNumber: string; accountName: string; isDefault?: boolean }) {
    return this.request('/api/v1/wallet/payment-methods', {
      method: 'POST',
      body: data,
    });
  }

  async requestWithdrawal(amount: number, paymentMethodId: string) {
    return this.request('/api/v1/wallet/withdraw', {
      method: 'POST',
      body: { amount, paymentMethodId },
    });
  }

  async getWithdrawalHistory(page = 1, limit = 20) {
    return this.request(`/api/v1/wallet/withdrawals?page=${page}&limit=${limit}`);
  }

  // Transaction endpoints
  async createTransaction(data: { itemName: string; amount: number; description?: string }) {
    return this.request('/api/v1/transactions', {
      method: 'POST',
      body: data,
    });
  }

  async getTransaction(id: string) {
    return this.request(`/api/v1/transactions/${id}`, { requireAuth: false });
  }

  async getTransactions(params: { role?: string; status?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/api/v1/transactions?${query}`);
  }

  async initiatePayment(transactionId: string, data: { paymentMethod: string; phone: string; buyerName?: string; buyerEmail?: string }) {
    return this.request(`/api/v1/transactions/${transactionId}/pay`, {
      method: 'POST',
      body: data,
      requireAuth: false,
    });
  }

  async confirmDelivery(transactionId: string) {
    return this.request(`/api/v1/transactions/${transactionId}/confirm`, {
      method: 'POST',
    });
  }

  // Seller endpoints
  async getSellerOrders(params: { status?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/api/v1/seller/orders?${query}`);
  }

  async getOrderDetails(orderId: string) {
    return this.request(`/api/v1/seller/orders/${orderId}`);
  }

  async acceptOrder(orderId: string) {
    return this.request(`/api/v1/seller/orders/${orderId}/accept`, { method: 'POST' });
  }

  async rejectOrder(orderId: string, reason?: string) {
    return this.request(`/api/v1/seller/orders/${orderId}/reject`, {
      method: 'POST',
      body: { reason },
    });
  }

  async addShippingInfo(orderId: string, data: { courierName: string; trackingNumber: string; estimatedDeliveryDate?: string; notes?: string }) {
    return this.request(`/api/v1/seller/orders/${orderId}/shipping`, {
      method: 'POST',
      body: data,
    });
  }

  async getSellerStats() {
    return this.request('/api/v1/seller/stats');
  }

  // Payment endpoints
  async initiateSTKPush(transactionId: string, phoneNumber: string, amount: number) {
    return this.request('/api/v1/payments/initiate-stk', {
      method: 'POST',
      body: { transactionId, phoneNumber, amount },
    });
  }

  async confirmDelivery(transactionId: string, deliveryOTP: string) {
    return this.request('/api/v1/payments/confirm-delivery', {
      method: 'POST',
      body: { transactionId, deliveryOTP },
    });
  }

  async checkPaymentStatus(transactionId: string) {
    return this.request('/api/v1/payments/check-status', {
      method: 'POST',
      body: { transactionId },
    });
  }
}

export const api = new ApiService();
