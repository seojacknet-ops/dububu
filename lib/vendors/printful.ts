/**
 * Printful API Client
 * Documentation: https://developers.printful.com/docs/
 */

import crypto from 'crypto';

const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulConfig {
  apiKey: string;
}

interface PrintfulAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
}

interface PrintfulOrderItem {
  sync_variant_id?: number;
  external_variant_id?: string;
  warehouse_product_variant_id?: number;
  quantity: number;
  retail_price?: string;
  name?: string;
  files?: PrintfulFile[];
}

interface PrintfulFile {
  url: string;
  type?: string;
}

interface PrintfulOrderRequest {
  recipient: PrintfulAddress;
  items: PrintfulOrderItem[];
  retail_costs?: {
    currency?: string;
    subtotal?: string;
    discount?: string;
    shipping?: string;
    tax?: string;
  };
  gift?: {
    subject?: string;
    message?: string;
  };
  packing_slip?: {
    email?: string;
    phone?: string;
    message?: string;
  };
}

interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export class PrintfulClient {
  private apiKey: string;

  constructor(config?: PrintfulConfig) {
    this.apiKey = config?.apiKey || process.env.PRINTFUL_API_KEY || '';

    if (!this.apiKey) {
      console.warn('[PRINTFUL] API key not configured');
    }
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.result || error.message || `Printful API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get store information
   */
  async getStore() {
    return this.fetch<{ result: { id: number; name: string } }>('/stores');
  }

  /**
   * List all sync products in your store
   */
  async getProducts(limit = 100, offset = 0) {
    return this.fetch<{
      result: Array<{
        id: number;
        external_id: string;
        name: string;
        variants: number;
        synced: number;
      }>;
    }>(`/store/products?limit=${limit}&offset=${offset}`);
  }

  /**
   * Get a specific sync product
   */
  async getProduct(id: number | string) {
    return this.fetch<{
      result: {
        sync_product: {
          id: number;
          external_id: string;
          name: string;
        };
        sync_variants: Array<{
          id: number;
          external_id: string;
          sync_product_id: number;
          name: string;
          synced: boolean;
          variant_id: number;
          retail_price: string;
          currency: string;
          product: {
            variant_id: number;
            product_id: number;
            image: string;
            name: string;
          };
        }>;
      };
    }>(`/store/products/${id}`);
  }

  /**
   * Calculate shipping rates
   */
  async getShippingRates(
    recipient: PrintfulAddress,
    items: Array<{ variant_id?: string; quantity: number; external_variant_id?: string }>
  ): Promise<PrintfulShippingRate[]> {
    const response = await this.fetch<{
      result: Array<{
        id: string;
        name: string;
        rate: string;
        currency: string;
        minDeliveryDays: number;
        maxDeliveryDays: number;
      }>;
    }>('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify({
        recipient,
        items,
      }),
    });

    return response.result;
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: PrintfulOrderRequest, confirm = false) {
    return this.fetch<{
      result: {
        id: number;
        external_id: string;
        status: string;
        shipping: string;
        shipping_service_name: string;
        created: number;
        updated: number;
        recipient: PrintfulAddress;
        items: Array<{
          id: number;
          external_id: string;
          variant_id: number;
          sync_variant_id: number;
          external_variant_id: string;
          quantity: number;
          price: string;
          retail_price: string;
          name: string;
          product: {
            variant_id: number;
            product_id: number;
            image: string;
            name: string;
          };
        }>;
        retail_costs: {
          currency: string;
          subtotal: string;
          discount: string;
          shipping: string;
          tax: string;
          total: string;
        };
      };
    }>(`/orders${confirm ? '?confirm=true' : ''}`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get order details
   */
  async getOrder(orderId: number | string) {
    return this.fetch<{
      result: {
        id: number;
        external_id: string;
        status: string;
        shipping: string;
        created: number;
        updated: number;
        shipments: Array<{
          id: number;
          carrier: string;
          service: string;
          tracking_number: string;
          tracking_url: string;
          created: number;
          ship_date: string;
          shipped_at: number;
          reshipment: boolean;
        }>;
      };
    }>(`/orders/${orderId}`);
  }

  /**
   * Confirm a draft order
   */
  async confirmOrder(orderId: number | string) {
    return this.fetch<{ result: { id: number; status: string } }>(
      `/orders/${orderId}/confirm`,
      { method: 'POST' }
    );
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number | string) {
    return this.fetch<{ result: { id: number; status: string } }>(
      `/orders/${orderId}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Get list of countries
   */
  async getCountries() {
    return this.fetch<{
      result: Array<{
        code: string;
        name: string;
        states: Array<{ code: string; name: string }> | null;
      }>;
    }>('/countries');
  }

  /**
   * Verify webhook signature from Printful
   * Printful signs webhooks using HMAC-SHA256 with the API key
   * @param body Raw request body (must be string/buffer, not parsed JSON)
   * @param signature The signature from X-PF-Signature header
   * @returns true if signature is valid, false otherwise
   */
  verifyWebhookSignature(body: string | Buffer, signature: string): boolean {
    if (!this.apiKey) {
      console.warn('[PRINTFUL] Cannot verify webhook signature: API key not configured');
      return false;
    }

    const bodyString = typeof body === 'string' ? body : body.toString('utf-8');
    const expectedSignature = crypto
      .createHmac('sha256', this.apiKey)
      .update(bodyString)
      .digest('hex');

    return signature === expectedSignature;
  }
}

// Singleton instance
export const printful = new PrintfulClient();

// Helper to create order from our order data
export async function createPrintfulOrderFromOrder(
  order: {
    orderNumber: string;
    email: string;
    shippingAddress: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      state?: string;
      zipCode: string;
      country: string;
      phone?: string;
    };
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      name: string;
      price: number;
      vendorVariantId?: string;
    }>;
  },
  autoConfirm = false
) {
  const printfulOrder: PrintfulOrderRequest = {
    recipient: {
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      address1: order.shippingAddress.address1,
      address2: order.shippingAddress.address2,
      city: order.shippingAddress.city,
      state_code: order.shippingAddress.state,
      country_code: order.shippingAddress.country === 'United States' ? 'US' : order.shippingAddress.country,
      zip: order.shippingAddress.zipCode,
      phone: order.shippingAddress.phone,
      email: order.email,
    },
    items: order.items
      .filter((item) => item.vendorVariantId) // Only include items with Printful variant IDs
      .map((item) => ({
        external_variant_id: item.vendorVariantId!,
        quantity: item.quantity,
        retail_price: item.price.toFixed(2),
      })),
  };

  if (printfulOrder.items.length === 0) {
    return { success: false, error: 'No Printful items in order' };
  }

  try {
    const result = await printful.createOrder(printfulOrder, autoConfirm);
    return {
      success: true,
      orderId: result.result.id,
      externalId: result.result.external_id,
      status: result.result.status,
    };
  } catch (error) {
    console.error('[PRINTFUL_CREATE_ORDER_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create Printful order',
    };
  }
}
