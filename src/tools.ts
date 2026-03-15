import { z } from 'zod';
import { SquareClient } from './api-client.js';

interface ToolDef {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (client: SquareClient, args: any) => Promise<any>;
}

export const tools: ToolDef[] = [
  // --- Payments ---
  {
    name: 'payments_list',
    description: 'List payments',
    inputSchema: z.object({
      begin_time: z.string().optional().describe('start time RFC 3339'),
      end_time: z.string().optional().describe('end time RFC 3339'),
      sort_order: z.enum(['ASC', 'DESC']).optional().describe('sort order'),
      cursor: z.string().optional().describe('pagination cursor'),
      location_id: z.string().optional().describe('location ID'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      begin_time?: string; end_time?: string; sort_order?: string;
      cursor?: string; location_id?: string; limit?: number;
    }) => client.listPayments(args),
  },
  {
    name: 'payment_get',
    description: 'Get payment details',
    inputSchema: z.object({
      payment_id: z.string().describe('payment ID'),
    }),
    handler: async (client, args: { payment_id: string }) =>
      client.getPayment(args.payment_id),
  },
  {
    name: 'payment_create',
    description: 'Create a payment',
    inputSchema: z.object({
      data: z.string().describe('payment JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createPayment(JSON.parse(args.data)),
  },
  {
    name: 'payment_cancel',
    description: 'Cancel/void a payment',
    inputSchema: z.object({
      payment_id: z.string().describe('payment ID'),
    }),
    handler: async (client, args: { payment_id: string }) =>
      client.cancelPayment(args.payment_id),
  },
  {
    name: 'payment_complete',
    description: 'Complete/capture a payment',
    inputSchema: z.object({
      payment_id: z.string().describe('payment ID'),
    }),
    handler: async (client, args: { payment_id: string }) =>
      client.completePayment(args.payment_id),
  },

  // --- Refunds ---
  {
    name: 'refunds_list',
    description: 'List payment refunds',
    inputSchema: z.object({
      begin_time: z.string().optional().describe('start time RFC 3339'),
      end_time: z.string().optional().describe('end time RFC 3339'),
      sort_order: z.enum(['ASC', 'DESC']).optional().describe('sort order'),
      cursor: z.string().optional().describe('pagination cursor'),
      location_id: z.string().optional().describe('location ID'),
      status: z.string().optional().describe('PENDING, COMPLETED, REJECTED, FAILED'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      begin_time?: string; end_time?: string; sort_order?: string;
      cursor?: string; location_id?: string; status?: string; limit?: number;
    }) => client.listRefunds(args),
  },
  {
    name: 'refund_create',
    description: 'Refund a payment',
    inputSchema: z.object({
      data: z.string().describe('refund JSON (payment_id, amount_money, idempotency_key)'),
    }),
    handler: async (client, args: { data: string }) =>
      client.refundPayment(JSON.parse(args.data)),
  },
  {
    name: 'refund_get',
    description: 'Get refund details',
    inputSchema: z.object({
      refund_id: z.string().describe('refund ID'),
    }),
    handler: async (client, args: { refund_id: string }) =>
      client.getRefund(args.refund_id),
  },

  // --- Orders ---
  {
    name: 'order_create',
    description: 'Create a new order',
    inputSchema: z.object({
      data: z.string().describe('order JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createOrder(JSON.parse(args.data)),
  },
  {
    name: 'order_get',
    description: 'Get order details',
    inputSchema: z.object({
      order_id: z.string().describe('order ID'),
    }),
    handler: async (client, args: { order_id: string }) =>
      client.getOrder(args.order_id),
  },
  {
    name: 'orders_search',
    description: 'Search orders across locations',
    inputSchema: z.object({
      data: z.string().describe('search query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.searchOrders(JSON.parse(args.data)),
  },
  {
    name: 'orders_batch_retrieve',
    description: 'Retrieve multiple orders by ID',
    inputSchema: z.object({
      order_ids: z.string().describe('comma-separated order IDs'),
      location_id: z.string().optional().describe('location ID'),
    }),
    handler: async (client, args: { order_ids: string; location_id?: string }) =>
      client.batchRetrieveOrders({
        order_ids: args.order_ids.split(',').map(s => s.trim()),
        location_id: args.location_id,
      }),
  },
  {
    name: 'order_pay',
    description: 'Pay for an order',
    inputSchema: z.object({
      order_id: z.string().describe('order ID'),
      data: z.string().describe('payment JSON'),
    }),
    handler: async (client, args: { order_id: string; data: string }) =>
      client.payOrder(args.order_id, JSON.parse(args.data)),
  },

  // --- Invoices ---
  {
    name: 'invoices_list',
    description: 'List invoices for a location',
    inputSchema: z.object({
      location_id: z.string().describe('location ID'),
      cursor: z.string().optional().describe('pagination cursor'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      location_id: string; cursor?: string; limit?: number;
    }) => client.listInvoices(args.location_id, { cursor: args.cursor, limit: args.limit }),
  },
  {
    name: 'invoice_get',
    description: 'Get invoice details',
    inputSchema: z.object({
      invoice_id: z.string().describe('invoice ID'),
    }),
    handler: async (client, args: { invoice_id: string }) =>
      client.getInvoice(args.invoice_id),
  },
  {
    name: 'invoice_create',
    description: 'Create a draft invoice',
    inputSchema: z.object({
      data: z.string().describe('invoice JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createInvoice(JSON.parse(args.data)),
  },
  {
    name: 'invoice_update',
    description: 'Update an invoice',
    inputSchema: z.object({
      invoice_id: z.string().describe('invoice ID'),
      data: z.string().describe('update JSON'),
    }),
    handler: async (client, args: { invoice_id: string; data: string }) =>
      client.updateInvoice(args.invoice_id, JSON.parse(args.data)),
  },
  {
    name: 'invoice_publish',
    description: 'Publish a draft invoice',
    inputSchema: z.object({
      invoice_id: z.string().describe('invoice ID'),
      data: z.string().describe('publish JSON (version, idempotency_key)'),
    }),
    handler: async (client, args: { invoice_id: string; data: string }) =>
      client.publishInvoice(args.invoice_id, JSON.parse(args.data)),
  },
  {
    name: 'invoice_cancel',
    description: 'Cancel an invoice',
    inputSchema: z.object({
      invoice_id: z.string().describe('invoice ID'),
      data: z.string().describe('cancel JSON (version)'),
    }),
    handler: async (client, args: { invoice_id: string; data: string }) =>
      client.cancelInvoice(args.invoice_id, JSON.parse(args.data)),
  },
  {
    name: 'invoices_search',
    description: 'Search invoices',
    inputSchema: z.object({
      data: z.string().describe('search query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.searchInvoices(JSON.parse(args.data)),
  },

  // --- Customers ---
  {
    name: 'customers_list',
    description: 'List customers',
    inputSchema: z.object({
      cursor: z.string().optional().describe('pagination cursor'),
      limit: z.number().optional().describe('max results'),
      sort_field: z.enum(['DEFAULT', 'CREATED_AT']).optional().describe('sort field'),
      sort_order: z.enum(['ASC', 'DESC']).optional().describe('sort order'),
    }),
    handler: async (client, args: {
      cursor?: string; limit?: number; sort_field?: string; sort_order?: string;
    }) => client.listCustomers(args),
  },
  {
    name: 'customer_get',
    description: 'Get customer details',
    inputSchema: z.object({
      customer_id: z.string().describe('customer ID'),
    }),
    handler: async (client, args: { customer_id: string }) =>
      client.getCustomer(args.customer_id),
  },
  {
    name: 'customer_create',
    description: 'Create a new customer',
    inputSchema: z.object({
      data: z.string().describe('customer JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createCustomer(JSON.parse(args.data)),
  },
  {
    name: 'customer_update',
    description: 'Update a customer',
    inputSchema: z.object({
      customer_id: z.string().describe('customer ID'),
      data: z.string().describe('update JSON'),
    }),
    handler: async (client, args: { customer_id: string; data: string }) =>
      client.updateCustomer(args.customer_id, JSON.parse(args.data)),
  },
  {
    name: 'customers_search',
    description: 'Search customers',
    inputSchema: z.object({
      data: z.string().describe('search query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.searchCustomers(JSON.parse(args.data)),
  },

  // --- Catalog ---
  {
    name: 'catalog_list',
    description: 'List catalog objects',
    inputSchema: z.object({
      cursor: z.string().optional().describe('pagination cursor'),
      types: z.string().optional().describe('ITEM, CATEGORY, TAX, DISCOUNT, etc'),
    }),
    handler: async (client, args: { cursor?: string; types?: string }) =>
      client.listCatalog(args),
  },
  {
    name: 'catalog_get',
    description: 'Get catalog object by ID',
    inputSchema: z.object({
      object_id: z.string().describe('catalog object ID'),
      include_related: z.boolean().optional().describe('include related objects'),
    }),
    handler: async (client, args: { object_id: string; include_related?: boolean }) =>
      client.getCatalogObject(args.object_id, { include_related_objects: args.include_related }),
  },
  {
    name: 'catalog_upsert',
    description: 'Create or update a catalog object',
    inputSchema: z.object({
      data: z.string().describe('catalog object JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.upsertCatalogObject(JSON.parse(args.data)),
  },
  {
    name: 'catalog_search',
    description: 'Search the catalog',
    inputSchema: z.object({
      data: z.string().describe('search query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.searchCatalog(JSON.parse(args.data)),
  },
  {
    name: 'catalog_search_items',
    description: 'Search catalog items with attributes',
    inputSchema: z.object({
      data: z.string().describe('search query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.searchCatalogItems(JSON.parse(args.data)),
  },
  {
    name: 'catalog_info',
    description: 'Get catalog API limits and info',
    inputSchema: z.object({}),
    handler: async (client) => client.getCatalogInfo(),
  },

  // --- Inventory ---
  {
    name: 'inventory_counts',
    description: 'Get inventory counts for items',
    inputSchema: z.object({
      data: z.string().describe('query JSON (catalog_object_ids, location_ids)'),
    }),
    handler: async (client, args: { data: string }) =>
      client.batchRetrieveInventoryCounts(JSON.parse(args.data)),
  },
  {
    name: 'inventory_count_get',
    description: 'Get inventory count for one item',
    inputSchema: z.object({
      catalog_object_id: z.string().describe('catalog object ID'),
      location_ids: z.string().optional().describe('comma-separated location IDs'),
    }),
    handler: async (client, args: { catalog_object_id: string; location_ids?: string }) =>
      client.retrieveInventoryCount(args.catalog_object_id, {
        location_ids: args.location_ids,
      }),
  },
  {
    name: 'inventory_adjust',
    description: 'Adjust inventory counts',
    inputSchema: z.object({
      data: z.string().describe('changes JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.batchChangeInventory(JSON.parse(args.data)),
  },
  {
    name: 'inventory_changes',
    description: 'Get inventory change history',
    inputSchema: z.object({
      data: z.string().describe('query JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.batchRetrieveInventoryChanges(JSON.parse(args.data)),
  },

  // --- Subscriptions ---
  {
    name: 'subscriptions_search',
    description: 'Search subscriptions',
    inputSchema: z.object({
      data: z.string().optional().describe('search query JSON'),
    }),
    handler: async (client, args: { data?: string }) =>
      client.searchSubscriptions(args.data ? JSON.parse(args.data) : { query: {} }),
  },
  {
    name: 'subscription_get',
    description: 'Get subscription details',
    inputSchema: z.object({
      subscription_id: z.string().describe('subscription ID'),
    }),
    handler: async (client, args: { subscription_id: string }) =>
      client.getSubscription(args.subscription_id),
  },
  {
    name: 'subscription_create',
    description: 'Create a subscription',
    inputSchema: z.object({
      data: z.string().describe('subscription JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createSubscription(JSON.parse(args.data)),
  },
  {
    name: 'subscription_cancel',
    description: 'Cancel a subscription',
    inputSchema: z.object({
      subscription_id: z.string().describe('subscription ID'),
    }),
    handler: async (client, args: { subscription_id: string }) =>
      client.cancelSubscription(args.subscription_id),
  },
  {
    name: 'subscription_resume',
    description: 'Resume a paused subscription',
    inputSchema: z.object({
      subscription_id: z.string().describe('subscription ID'),
    }),
    handler: async (client, args: { subscription_id: string }) =>
      client.resumeSubscription(args.subscription_id),
  },

  // --- Disputes ---
  {
    name: 'disputes_list',
    description: 'List payment disputes',
    inputSchema: z.object({
      cursor: z.string().optional().describe('pagination cursor'),
      states: z.string().optional().describe('filter by states'),
      location_id: z.string().optional().describe('location ID'),
    }),
    handler: async (client, args: {
      cursor?: string; states?: string; location_id?: string;
    }) => client.listDisputes(args),
  },
  {
    name: 'dispute_get',
    description: 'Get dispute details',
    inputSchema: z.object({
      dispute_id: z.string().describe('dispute ID'),
    }),
    handler: async (client, args: { dispute_id: string }) =>
      client.getDispute(args.dispute_id),
  },
  {
    name: 'dispute_accept',
    description: 'Accept loss on a dispute',
    inputSchema: z.object({
      dispute_id: z.string().describe('dispute ID'),
    }),
    handler: async (client, args: { dispute_id: string }) =>
      client.acceptDispute(args.dispute_id),
  },
  {
    name: 'dispute_evidence_list',
    description: 'List evidence for a dispute',
    inputSchema: z.object({
      dispute_id: z.string().describe('dispute ID'),
    }),
    handler: async (client, args: { dispute_id: string }) =>
      client.listDisputeEvidence(args.dispute_id),
  },

  // --- Locations ---
  {
    name: 'locations_list',
    description: 'List all business locations',
    inputSchema: z.object({}),
    handler: async (client) => client.listLocations(),
  },
  {
    name: 'location_get',
    description: 'Get location details',
    inputSchema: z.object({
      location_id: z.string().describe('location ID'),
    }),
    handler: async (client, args: { location_id: string }) =>
      client.getLocation(args.location_id),
  },
  {
    name: 'location_create',
    description: 'Create a new location',
    inputSchema: z.object({
      data: z.string().describe('location JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createLocation(JSON.parse(args.data)),
  },

  // --- Merchants ---
  {
    name: 'merchants_list',
    description: 'List merchants',
    inputSchema: z.object({}),
    handler: async (client) => client.listMerchants(),
  },
  {
    name: 'merchant_get',
    description: 'Get merchant details',
    inputSchema: z.object({
      merchant_id: z.string().describe('merchant ID'),
    }),
    handler: async (client, args: { merchant_id: string }) =>
      client.getMerchant(args.merchant_id),
  },

  // --- Payouts ---
  {
    name: 'payouts_list',
    description: 'List payouts',
    inputSchema: z.object({
      location_id: z.string().optional().describe('location ID'),
      status: z.string().optional().describe('SENT, FAILED, etc'),
      begin_time: z.string().optional().describe('start time RFC 3339'),
      end_time: z.string().optional().describe('end time RFC 3339'),
      cursor: z.string().optional().describe('pagination cursor'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      location_id?: string; status?: string; begin_time?: string;
      end_time?: string; cursor?: string; limit?: number;
    }) => client.listPayouts(args),
  },
  {
    name: 'payout_get',
    description: 'Get payout details',
    inputSchema: z.object({
      payout_id: z.string().describe('payout ID'),
    }),
    handler: async (client, args: { payout_id: string }) =>
      client.getPayout(args.payout_id),
  },
  {
    name: 'payout_entries',
    description: 'List entries for a payout',
    inputSchema: z.object({
      payout_id: z.string().describe('payout ID'),
      cursor: z.string().optional().describe('pagination cursor'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      payout_id: string; cursor?: string; limit?: number;
    }) => client.listPayoutEntries(args.payout_id, { cursor: args.cursor, limit: args.limit }),
  },

  // --- Gift Cards ---
  {
    name: 'giftcards_list',
    description: 'List gift cards',
    inputSchema: z.object({
      type: z.string().optional().describe('PHYSICAL or DIGITAL'),
      state: z.string().optional().describe('ACTIVE, DEACTIVATED, etc'),
      cursor: z.string().optional().describe('pagination cursor'),
      limit: z.number().optional().describe('max results'),
    }),
    handler: async (client, args: {
      type?: string; state?: string; cursor?: string; limit?: number;
    }) => client.listGiftCards(args),
  },
  {
    name: 'giftcard_get',
    description: 'Get gift card details',
    inputSchema: z.object({
      id: z.string().describe('gift card ID'),
    }),
    handler: async (client, args: { id: string }) => client.getGiftCard(args.id),
  },
  {
    name: 'giftcard_from_gan',
    description: 'Look up gift card by number',
    inputSchema: z.object({
      gan: z.string().describe('gift card account number'),
    }),
    handler: async (client, args: { gan: string }) =>
      client.getGiftCardFromGAN({ gan: args.gan }),
  },

  // --- Team ---
  {
    name: 'team_search',
    description: 'Search team members',
    inputSchema: z.object({
      data: z.string().optional().describe('search query JSON'),
    }),
    handler: async (client, args: { data?: string }) =>
      client.searchTeamMembers(args.data ? JSON.parse(args.data) : undefined),
  },
  {
    name: 'team_member_get',
    description: 'Get team member details',
    inputSchema: z.object({
      team_member_id: z.string().describe('team member ID'),
    }),
    handler: async (client, args: { team_member_id: string }) =>
      client.getTeamMember(args.team_member_id),
  },
];
