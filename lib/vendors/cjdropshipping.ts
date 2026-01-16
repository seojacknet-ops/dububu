/**
 * CJDropshipping API Client
 * Documentation: https://developers.cjdropshipping.com/
 */

const CJ_API_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

interface CJConfig {
  apiKey: string;
}

interface CJAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  countryCode: string;
  province: string;
  city: string;
  address: string;
  address2?: string;
  zip: string;
}

interface CJOrderProduct {
  vid: string; // CJ variant ID
  quantity: number;
}

interface CJOrderRequest {
  orderNumber: string;
  shippingZip: string;
  shippingCountryCode: string;
  shippingCountry: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  shippingAddress2?: string;
  shippingCustomerName: string;
  shippingPhone: string;
  remark?: string;
  fromCountryCode?: string;
  logisticName?: string;
  products: CJOrderProduct[];
}

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: number;
  productType: string;
  productUnit: string;
  sellPrice: number;
  categoryId: string;
  variants: CJVariant[];
}

interface CJVariant {
  vid: string;
  variantName: string;
  variantNameEn: string;
  variantSku: string;
  variantImage: string;
  variantStandard: string;
  variantKey: string;
  variantProperty: string;
  variantVolume: string;
  variantWeight: number;
  variantSellPrice: number;
  variantStock: number;
}

interface CJShippingMethod {
  logisticName: string;
  logisticAging: string;
  logisticPrice: number;
  logisticPriceCn: number;
}

export class CJDropshippingClient {
  private apiKey: string;
  private accessToken: string = '';

  constructor(config?: CJConfig) {
    this.apiKey = config?.apiKey || process.env.CJDROPSHIPPING_API_KEY || '';

    if (!this.apiKey) {
      console.warn('[CJDROPSHIPPING] API key not configured');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const response = await fetch(`${CJ_API_URL}/authentication/getAccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.CJDROPSHIPPING_EMAIL,
        password: process.env.CJDROPSHIPPING_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get CJ access token');
    }

    const data = await response.json();

    if (!data.data?.accessToken) {
      throw new Error('Invalid CJ authentication response');
    }

    this.accessToken = data.data.accessToken;
    return this.accessToken;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${CJ_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'CJ-Access-Token': token,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `CJ API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error(data.message || 'CJ API request failed');
    }

    return data;
  }

  /**
   * Search products
   */
  async searchProducts(query: string, page = 1, pageSize = 20) {
    return this.fetch<{
      result: boolean;
      code: number;
      data: {
        list: CJProduct[];
        pageNum: number;
        pageSize: number;
        total: number;
      };
    }>(`/product/list?productNameEn=${encodeURIComponent(query)}&pageNum=${page}&pageSize=${pageSize}`);
  }

  /**
   * Get product details
   */
  async getProduct(productId: string) {
    return this.fetch<{
      result: boolean;
      data: CJProduct;
    }>(`/product/query?pid=${productId}`);
  }

  /**
   * Get product variants
   */
  async getProductVariants(productId: string) {
    return this.fetch<{
      result: boolean;
      data: CJVariant[];
    }>(`/product/variant/query?pid=${productId}`);
  }

  /**
   * Get shipping methods and rates
   */
  async getShippingMethods(params: {
    startCountryCode?: string;
    endCountryCode: string;
    products: Array<{ vid: string; quantity: number }>;
  }): Promise<CJShippingMethod[]> {
    const response = await this.fetch<{
      result: boolean;
      data: CJShippingMethod[];
    }>('/logistic/freightCalculate', {
      method: 'POST',
      body: JSON.stringify({
        startCountryCode: params.startCountryCode || 'CN',
        endCountryCode: params.endCountryCode,
        products: params.products,
      }),
    });

    return response.data;
  }

  /**
   * Create an order
   */
  async createOrder(orderData: CJOrderRequest) {
    return this.fetch<{
      result: boolean;
      data: {
        orderId: string;
        orderNum: string;
      };
    }>('/shopping/order/createOrder', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string) {
    return this.fetch<{
      result: boolean;
      data: {
        orderId: string;
        orderNum: string;
        orderStatus: string;
        shippingCountry: string;
        createDate: string;
        productAmount: number;
        postageAmount: number;
        orderAmount: number;
        trackNumber: string;
        logisticName: string;
        productList: Array<{
          vid: string;
          variantName: string;
          quantity: number;
          sellPrice: number;
        }>;
      };
    }>(`/shopping/order/getOrderDetail?orderId=${orderId}`);
  }

  /**
   * Get tracking info
   */
  async getTracking(orderId: string) {
    return this.fetch<{
      result: boolean;
      data: {
        trackNumber: string;
        logisticName: string;
        trackInfo: Array<{
          date: string;
          info: string;
        }>;
      };
    }>(`/logistic/getTrackInfo?orderId=${orderId}`);
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string) {
    return this.fetch<{
      result: boolean;
      message: string;
    }>(`/shopping/order/deleteOrder?orderId=${orderId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get inventory/stock for a variant
   */
  async getStock(vid: string) {
    return this.fetch<{
      result: boolean;
      data: {
        vid: string;
        stock: number;
      };
    }>(`/product/stock?vid=${vid}`);
  }
}

// Singleton instance
export const cjDropshipping = new CJDropshippingClient();

// Helper to create order from our order data
export async function createCJOrderFromOrder(
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
  shippingMethod?: string
) {
  // Map country name to code
  const countryMap: Record<string, string> = {
    'United States': 'US',
    USA: 'US',
    Canada: 'CA',
    'United Kingdom': 'GB',
    UK: 'GB',
    Australia: 'AU',
    Germany: 'DE',
    France: 'FR',
    Italy: 'IT',
    Spain: 'ES',
    Netherlands: 'NL',
    Belgium: 'BE',
  };

  const countryCode = countryMap[order.shippingAddress.country] || order.shippingAddress.country;

  const cjOrderItems = order.items
    .filter((item) => item.vendorVariantId) // Only include items with CJ variant IDs
    .map((item) => ({
      vid: item.vendorVariantId!,
      quantity: item.quantity,
    }));

  if (cjOrderItems.length === 0) {
    return { success: false, error: 'No CJ items in order' };
  }

  const cjOrder: CJOrderRequest = {
    orderNumber: order.orderNumber,
    shippingZip: order.shippingAddress.zipCode,
    shippingCountryCode: countryCode,
    shippingCountry: order.shippingAddress.country,
    shippingProvince: order.shippingAddress.state || '',
    shippingCity: order.shippingAddress.city,
    shippingAddress: order.shippingAddress.address1,
    shippingAddress2: order.shippingAddress.address2,
    shippingCustomerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    shippingPhone: order.shippingAddress.phone || '',
    logisticName: shippingMethod,
    products: cjOrderItems,
  };

  try {
    const result = await cjDropshipping.createOrder(cjOrder);
    return {
      success: true,
      orderId: result.data.orderId,
      orderNum: result.data.orderNum,
    };
  } catch (error) {
    console.error('[CJ_CREATE_ORDER_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create CJ order',
    };
  }
}
