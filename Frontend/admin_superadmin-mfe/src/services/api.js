const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('admin_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/api/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async logout() {
    return this.request('/api/admin/auth/logout', { method: 'POST' });
  }

  // Admin Management endpoints (SuperAdmin only)
  async getAdmins(page = 0, size = 10, search = '', role = '', status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...(role && { role }),
      ...(status && { status }),
    });
    return this.request(`/api/admin/admins?${params}`);
  }

  async getAdminById(id) {
    return this.request(`/api/admin/admins/${id}`);
  }

  async createAdmin(data) {
    return this.request('/api/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdmin(id, data) {
    return this.request(`/api/admin/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async suspendAdmin(id, reason) {
    return this.request(`/api/admin/admins/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async activateAdmin(id) {
    return this.request(`/api/admin/admins/${id}/activate`, {
      method: 'POST',
    });
  }

  async deleteAdmin(id) {
    return this.request(`/api/admin/admins/${id}`, { method: 'DELETE' });
  }

  // System Configuration endpoints
  async getConfigs(category = '') {
    const params = category ? `?category=${category}` : '';
    return this.request(`/api/admin/config${params}`);
  }

  async getConfigByKey(key) {
    return this.request(`/api/admin/config/${key}`);
  }

  async updateConfig(key, data) {
    return this.request(`/api/admin/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createConfig(data) {
    return this.request('/api/admin/config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fraud Alert endpoints
  async getFraudAlerts(page = 0, size = 10, status = '', type = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(status && { status }),
      ...(type && { type }),
    });
    return this.request(`/api/admin/fraud-alerts?${params}`);
  }

  async getFraudAlertById(id) {
    return this.request(`/api/admin/fraud-alerts/${id}`);
  }

  async reviewFraudAlert(id, data) {
    return this.request(`/api/admin/fraud-alerts/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async escalateFraudAlert(id) {
    return this.request(`/api/admin/fraud-alerts/${id}/escalate`, {
      method: 'POST',
    });
  }

  // Service Health endpoints
  async getServiceHealth() {
    return this.request('/api/admin/services');
  }

  async getServiceHealthById(id) {
    return this.request(`/api/admin/services/${id}`);
  }

  async triggerHealthCheck(id) {
    return this.request(`/api/admin/services/${id}/check`, {
      method: 'POST',
    });
  }

  // Audit Log endpoints
  async getAuditLogs(page = 0, size = 10, action = '', entityType = '', severity = '', startDate = '', endDate = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...(severity && { severity }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return this.request(`/api/admin/audit-logs?${params}`);
  }

  async getAuditLogById(id) {
    return this.request(`/api/admin/audit-logs/${id}`);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/api/admin/dashboard/stats');
  }

  async getAdminDashboard() {
    return this.request('/api/admin/dashboard/admin');
  }

  async getSuperAdminDashboard() {
    return this.request('/api/admin/dashboard/superadmin');
  }

  async getCurrentProfile() {
    return this.request('/api/admin/dashboard/me');
  }

  // Reports endpoints
  async generateComplianceReport(startDate, endDate, reportType) {
    const params = new URLSearchParams({ startDate, endDate, ...(reportType && { reportType }) });
    return this.request(`/api/admin/reports/compliance?${params}`);
  }

  async generateTransactionReport(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate });
    return this.request(`/api/admin/reports/transactions?${params}`);
  }

  async generateAuditReport(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate });
    return this.request(`/api/admin/reports/audit?${params}`);
  }

  async generateRiskAssessmentReport(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate });
    return this.request(`/api/admin/reports/risk-assessment?${params}`);
  }

  // User Management (proxy to user-service)
  async getUsers() {
    return this.request('/api/admin/users');
  }

  async getUserById(id) {
    return this.request(`/api/admin/users/${id}`);
  }

  async updateUserStatus(id, status, reason) {
    return this.request(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async updateUserPremium(id, premium) {
    return this.request(`/api/admin/users/${id}/premium`, {
      method: 'PUT',
      body: JSON.stringify({ premium }),
    });
  }

  async resetUser2FA(id) {
    return this.request(`/api/admin/users/${id}/reset-2fa`, { method: 'POST' });
  }

  async resetUserPassword(id) {
    return this.request(`/api/admin/users/${id}/reset-password`, { method: 'POST' });
  }

  // Account Management (proxy to account-service)
  async getAccounts() {
    return this.request('/api/admin/accounts');
  }

  async getAccountById(id) {
    return this.request(`/api/admin/accounts/${id}`);
  }

  async freezeAccount(id, reason) {
    return this.request(`/api/admin/accounts/${id}/freeze`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async unfreezeAccount(id) {
    return this.request(`/api/admin/accounts/${id}/unfreeze`, { method: 'POST' });
  }

  async closeAccount(id) {
    return this.request(`/api/admin/accounts/${id}/close`, { method: 'POST' });
  }

  async updateAccountInterestRate(id, rate) {
    return this.request(`/api/admin/accounts/${id}/interest-rate`, {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
