export class SquareClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string, baseUrl?: string) {
    this.accessToken = accessToken;
    this.baseUrl = (baseUrl || 'https://connect.squareup.com').replace(/\/+$/, '');
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, string | number | boolean | undefined>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params } = options;
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Square-Version': '2025-01-23',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 204) return {} as T;

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    return response.json();
  }

  // --- Payments ---

  async listPayments(params?: {
    begin_time?: string; end_time?: string; sort_order?: string;
    cursor?: string; location_id?: string; total?: number; last_4?: string;
    card_brand?: string; limit?: number;
  }) {
    return this.request<any>('/v2/payments', { params });
  }

  async createPayment(body: any) {
    return this.request<any>('/v2/payments', { method: 'POST', body });
  }

  async getPayment(paymentId: string) {
    return this.request<any>(`/v2/payments/${encodeURIComponent(paymentId)}`);
  }

  async updatePayment(paymentId: string, body: any) {
    return this.request<any>(`/v2/payments/${encodeURIComponent(paymentId)}`, { method: 'PUT', body });
  }

  async cancelPayment(paymentId: string) {
    return this.request<any>(`/v2/payments/${encodeURIComponent(paymentId)}/cancel`, { method: 'POST' });
  }

  async completePayment(paymentId: string, body?: any) {
    return this.request<any>(`/v2/payments/${encodeURIComponent(paymentId)}/complete`, { method: 'POST', body });
  }

  // --- Refunds ---

  async listRefunds(params?: {
    begin_time?: string; end_time?: string; sort_order?: string;
    cursor?: string; location_id?: string; status?: string; source_type?: string; limit?: number;
  }) {
    return this.request<any>('/v2/refunds', { params });
  }

  async refundPayment(body: any) {
    return this.request<any>('/v2/refunds', { method: 'POST', body });
  }

  async getRefund(refundId: string) {
    return this.request<any>(`/v2/refunds/${encodeURIComponent(refundId)}`);
  }

  // --- Orders ---

  async createOrder(body: any) {
    return this.request<any>('/v2/orders', { method: 'POST', body });
  }

  async getOrder(orderId: string) {
    return this.request<any>(`/v2/orders/${encodeURIComponent(orderId)}`);
  }

  async updateOrder(orderId: string, body: any) {
    return this.request<any>(`/v2/orders/${encodeURIComponent(orderId)}`, { method: 'PUT', body });
  }

  async searchOrders(body: any) {
    return this.request<any>('/v2/orders/search', { method: 'POST', body });
  }

  async batchRetrieveOrders(body: { location_id?: string; order_ids: string[] }) {
    return this.request<any>('/v2/orders/batch-retrieve', { method: 'POST', body });
  }

  async payOrder(orderId: string, body: any) {
    return this.request<any>(`/v2/orders/${encodeURIComponent(orderId)}/pay`, { method: 'POST', body });
  }

  // --- Invoices ---

  async listInvoices(locationId: string, params?: { cursor?: string; limit?: number }) {
    return this.request<any>('/v2/invoices', { params: { location_id: locationId, ...params } });
  }

  async createInvoice(body: any) {
    return this.request<any>('/v2/invoices', { method: 'POST', body });
  }

  async getInvoice(invoiceId: string) {
    return this.request<any>(`/v2/invoices/${encodeURIComponent(invoiceId)}`);
  }

  async updateInvoice(invoiceId: string, body: any) {
    return this.request<any>(`/v2/invoices/${encodeURIComponent(invoiceId)}`, { method: 'PUT', body });
  }

  async deleteInvoice(invoiceId: string, params?: { version?: number }) {
    return this.request<any>(`/v2/invoices/${encodeURIComponent(invoiceId)}`, { method: 'DELETE', params });
  }

  async publishInvoice(invoiceId: string, body: any) {
    return this.request<any>(`/v2/invoices/${encodeURIComponent(invoiceId)}/publish`, { method: 'POST', body });
  }

  async cancelInvoice(invoiceId: string, body: any) {
    return this.request<any>(`/v2/invoices/${encodeURIComponent(invoiceId)}/cancel`, { method: 'POST', body });
  }

  async searchInvoices(body: any) {
    return this.request<any>('/v2/invoices/search', { method: 'POST', body });
  }

  // --- Customers ---

  async listCustomers(params?: {
    cursor?: string; limit?: number; sort_field?: string; sort_order?: string;
  }) {
    return this.request<any>('/v2/customers', { params });
  }

  async createCustomer(body: any) {
    return this.request<any>('/v2/customers', { method: 'POST', body });
  }

  async getCustomer(customerId: string) {
    return this.request<any>(`/v2/customers/${encodeURIComponent(customerId)}`);
  }

  async updateCustomer(customerId: string, body: any) {
    return this.request<any>(`/v2/customers/${encodeURIComponent(customerId)}`, { method: 'PUT', body });
  }

  async deleteCustomer(customerId: string, params?: { version?: number }) {
    return this.request<any>(`/v2/customers/${encodeURIComponent(customerId)}`, { method: 'DELETE', params });
  }

  async searchCustomers(body: any) {
    return this.request<any>('/v2/customers/search', { method: 'POST', body });
  }

  // --- Catalog ---

  async listCatalog(params?: {
    cursor?: string; types?: string; catalog_version?: number;
  }) {
    return this.request<any>('/v2/catalog/list', { params });
  }

  async getCatalogObject(objectId: string, params?: {
    include_related_objects?: boolean; catalog_version?: number;
  }) {
    return this.request<any>(`/v2/catalog/object/${encodeURIComponent(objectId)}`, { params });
  }

  async upsertCatalogObject(body: any) {
    return this.request<any>('/v2/catalog/object', { method: 'POST', body });
  }

  async deleteCatalogObject(objectId: string) {
    return this.request<any>(`/v2/catalog/object/${encodeURIComponent(objectId)}`, { method: 'DELETE' });
  }

  async searchCatalog(body: any) {
    return this.request<any>('/v2/catalog/search', { method: 'POST', body });
  }

  async batchUpsertCatalog(body: any) {
    return this.request<any>('/v2/catalog/batch-upsert', { method: 'POST', body });
  }

  async batchRetrieveCatalog(body: { object_ids: string[]; include_related_objects?: boolean }) {
    return this.request<any>('/v2/catalog/batch-retrieve', { method: 'POST', body });
  }

  async getCatalogInfo() {
    return this.request<any>('/v2/catalog/info');
  }

  async searchCatalogItems(body: any) {
    return this.request<any>('/v2/catalog/search-catalog-items', { method: 'POST', body });
  }

  // --- Inventory ---

  async batchRetrieveInventoryCounts(body: any) {
    return this.request<any>('/v2/inventory/counts/batch-retrieve', { method: 'POST', body });
  }

  async batchChangeInventory(body: any) {
    return this.request<any>('/v2/inventory/changes/batch-create', { method: 'POST', body });
  }

  async retrieveInventoryCount(catalogObjectId: string, params?: {
    location_ids?: string; cursor?: string;
  }) {
    return this.request<any>(`/v2/inventory/${encodeURIComponent(catalogObjectId)}`, { params });
  }

  async batchRetrieveInventoryChanges(body: any) {
    return this.request<any>('/v2/inventory/changes/batch-retrieve', { method: 'POST', body });
  }

  // --- Subscriptions ---

  async listSubscriptions(params?: { cursor?: string; limit?: number; location_id?: string }) {
    // Square uses search for listing subscriptions
    return this.request<any>('/v2/subscriptions/search', { method: 'POST', body: { query: {} } });
  }

  async createSubscription(body: any) {
    return this.request<any>('/v2/subscriptions', { method: 'POST', body });
  }

  async getSubscription(subscriptionId: string, params?: { include?: string }) {
    return this.request<any>(`/v2/subscriptions/${encodeURIComponent(subscriptionId)}`, { params });
  }

  async updateSubscription(subscriptionId: string, body: any) {
    return this.request<any>(`/v2/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: 'PUT', body });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request<any>(`/v2/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, { method: 'POST' });
  }

  async resumeSubscription(subscriptionId: string) {
    return this.request<any>(`/v2/subscriptions/${encodeURIComponent(subscriptionId)}/resume`, { method: 'POST' });
  }

  async searchSubscriptions(body: any) {
    return this.request<any>('/v2/subscriptions/search', { method: 'POST', body });
  }

  // --- Disputes ---

  async listDisputes(params?: {
    cursor?: string; states?: string; location_id?: string;
  }) {
    return this.request<any>('/v2/disputes', { params });
  }

  async getDispute(disputeId: string) {
    return this.request<any>(`/v2/disputes/${encodeURIComponent(disputeId)}`);
  }

  async acceptDispute(disputeId: string) {
    return this.request<any>(`/v2/disputes/${encodeURIComponent(disputeId)}/accept`, { method: 'POST' });
  }

  async listDisputeEvidence(disputeId: string) {
    return this.request<any>(`/v2/disputes/${encodeURIComponent(disputeId)}/evidence`);
  }

  async submitDisputeEvidence(disputeId: string) {
    return this.request<any>(`/v2/disputes/${encodeURIComponent(disputeId)}/submit-evidence`, { method: 'POST' });
  }

  // --- Locations ---

  async listLocations() {
    return this.request<any>('/v2/locations');
  }

  async getLocation(locationId: string) {
    return this.request<any>(`/v2/locations/${encodeURIComponent(locationId)}`);
  }

  async createLocation(body: any) {
    return this.request<any>('/v2/locations', { method: 'POST', body });
  }

  async updateLocation(locationId: string, body: any) {
    return this.request<any>(`/v2/locations/${encodeURIComponent(locationId)}`, { method: 'PUT', body });
  }

  // --- Merchants ---

  async listMerchants() {
    return this.request<any>('/v2/merchants');
  }

  async getMerchant(merchantId: string) {
    return this.request<any>(`/v2/merchants/${encodeURIComponent(merchantId)}`);
  }

  // --- Payouts ---

  async listPayouts(params?: {
    location_id?: string; status?: string; begin_time?: string;
    end_time?: string; sort_order?: string; cursor?: string; limit?: number;
  }) {
    return this.request<any>('/v2/payouts', { params });
  }

  async getPayout(payoutId: string) {
    return this.request<any>(`/v2/payouts/${encodeURIComponent(payoutId)}`);
  }

  async listPayoutEntries(payoutId: string, params?: {
    sort_order?: string; cursor?: string; limit?: number;
  }) {
    return this.request<any>(`/v2/payouts/${encodeURIComponent(payoutId)}/payout-entries`, { params });
  }

  // --- Gift Cards ---

  async listGiftCards(params?: {
    type?: string; state?: string; cursor?: string; limit?: number;
  }) {
    return this.request<any>('/v2/gift-cards', { params });
  }

  async createGiftCard(body: any) {
    return this.request<any>('/v2/gift-cards', { method: 'POST', body });
  }

  async getGiftCard(id: string) {
    return this.request<any>(`/v2/gift-cards/${encodeURIComponent(id)}`);
  }

  async getGiftCardFromGAN(body: { gan: string }) {
    return this.request<any>('/v2/gift-cards/from-gan', { method: 'POST', body });
  }

  // --- Team ---

  async searchTeamMembers(body?: any) {
    return this.request<any>('/v2/team-members/search', { method: 'POST', body: body || {} });
  }

  async getTeamMember(teamMemberId: string) {
    return this.request<any>(`/v2/team-members/${encodeURIComponent(teamMemberId)}`);
  }

  async createTeamMember(body: any) {
    return this.request<any>('/v2/team-members', { method: 'POST', body });
  }

  async updateTeamMember(teamMemberId: string, body: any) {
    return this.request<any>(`/v2/team-members/${encodeURIComponent(teamMemberId)}`, { method: 'PUT', body });
  }
}
