/**
 * Order Fulfillment Automation
 * Automatically routes orders to the appropriate vendor (Printful, CJDropshipping)
 */

import { db } from '@/lib/db';
import { VendorType } from '@prisma/client';
import { createPrintfulOrderFromOrder, printful } from './printful';
import { createCJOrderFromOrder, cjDropshipping } from './cjdropshipping';

interface FulfillmentResult {
  success: boolean;
  vendorOrderId?: string;
  vendorType?: VendorType;
  trackingNumber?: string;
  trackingUrl?: string;
  error?: string;
}

/**
 * Process and fulfill an order automatically
 */
export async function fulfillOrder(orderId: string): Promise<FulfillmentResult> {
  try {
    // Get order with items and product vendor info
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.fulfillmentStatus !== 'UNFULFILLED') {
      return { success: false, error: 'Order already fulfilled or in progress' };
    }

    // Group items by vendor type
    const itemsByVendor = groupItemsByVendor(order.items);

    const results: FulfillmentResult[] = [];

    // Process Printful items
    if (itemsByVendor.PRINTFUL.length > 0) {
      const printfulResult = await processPrintfulOrder(order, itemsByVendor.PRINTFUL);
      results.push(printfulResult);
    }

    // Process CJDropshipping items
    if (itemsByVendor.CJDROPSHIPPING.length > 0) {
      const cjResult = await processCJOrder(order, itemsByVendor.CJDROPSHIPPING);
      results.push(cjResult);
    }

    // Process manual/other items (notify admin)
    if (itemsByVendor.MANUAL.length > 0 || itemsByVendor.OTHER.length > 0) {
      // These need manual processing - just log for now
      console.log('[FULFILLMENT] Manual items require attention for order:', order.orderNumber);
    }

    // Update order status based on results
    const allSuccessful = results.every((r) => r.success);
    const anySuccessful = results.some((r) => r.success);

    await db.order.update({
      where: { id: orderId },
      data: {
        fulfillmentStatus: allSuccessful
          ? 'FULFILLED'
          : anySuccessful
          ? 'PARTIALLY_FULFILLED'
          : 'UNFULFILLED',
        status: allSuccessful ? 'PROCESSING' : order.status,
        vendorOrderId: results.find((r) => r.vendorOrderId)?.vendorOrderId,
        vendorType: results.find((r) => r.vendorType)?.vendorType,
      },
    });

    return {
      success: anySuccessful,
      vendorOrderId: results.find((r) => r.vendorOrderId)?.vendorOrderId,
      vendorType: results.find((r) => r.vendorType)?.vendorType,
      error: results.find((r) => r.error)?.error,
    };
  } catch (error) {
    console.error('[FULFILLMENT_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fulfillment failed',
    };
  }
}

function groupItemsByVendor(items: Array<{ product: { vendorType: VendorType | null } | null }>) {
  const groups: Record<string, typeof items> = {
    PRINTFUL: [],
    CJDROPSHIPPING: [],
    ALIEXPRESS: [],
    MANUAL: [],
    OTHER: [],
  };

  for (const item of items) {
    const vendorType = item.product?.vendorType || 'OTHER';
    if (groups[vendorType]) {
      groups[vendorType].push(item);
    } else {
      groups.OTHER.push(item);
    }
  }

  return groups;
}

async function processPrintfulOrder(
  order: {
    orderNumber: string;
    email: string;
    shippingAddress: unknown;
  },
  items: Array<{
    product: { name: string } | null;
    variant: { vendorVariantId: string | null } | null;
    quantity: number;
    price: unknown;
  }>
): Promise<FulfillmentResult> {
  try {
    const shippingAddress = order.shippingAddress as {
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

    const result = await createPrintfulOrderFromOrder({
      orderNumber: order.orderNumber,
      email: order.email,
      shippingAddress,
      items: items.map((item) => ({
        productId: '',
        quantity: item.quantity,
        name: item.product?.name || 'Product',
        price: Number(item.price),
        vendorVariantId: item.variant?.vendorVariantId || undefined,
      })),
    });

    if (result.success) {
      return {
        success: true,
        vendorOrderId: String(result.orderId),
        vendorType: VendorType.PRINTFUL,
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('[PRINTFUL_FULFILLMENT_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Printful fulfillment failed',
    };
  }
}

async function processCJOrder(
  order: {
    orderNumber: string;
    email: string;
    shippingAddress: unknown;
  },
  items: Array<{
    product: { name: string } | null;
    variant: { vendorVariantId: string | null } | null;
    quantity: number;
    price: unknown;
  }>
): Promise<FulfillmentResult> {
  try {
    const shippingAddress = order.shippingAddress as {
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

    const result = await createCJOrderFromOrder({
      orderNumber: order.orderNumber,
      email: order.email,
      shippingAddress,
      items: items.map((item) => ({
        productId: '',
        quantity: item.quantity,
        name: item.product?.name || 'Product',
        price: Number(item.price),
        vendorVariantId: item.variant?.vendorVariantId || undefined,
      })),
    });

    if (result.success) {
      return {
        success: true,
        vendorOrderId: result.orderId,
        vendorType: VendorType.CJDROPSHIPPING,
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('[CJ_FULFILLMENT_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'CJ fulfillment failed',
    };
  }
}

/**
 * Sync tracking information from vendors
 */
export async function syncOrderTracking(orderId: string): Promise<{
  success: boolean;
  trackingNumber?: string;
  trackingUrl?: string;
  error?: string;
}> {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order || !order.vendorOrderId || !order.vendorType) {
      return { success: false, error: 'Order has no vendor information' };
    }

    let trackingNumber: string | undefined;
    let trackingUrl: string | undefined;

    if (order.vendorType === VendorType.PRINTFUL) {
      const printfulOrder = await printful.getOrder(order.vendorOrderId);
      const shipment = printfulOrder.result.shipments?.[0];
      if (shipment) {
        trackingNumber = shipment.tracking_number;
        trackingUrl = shipment.tracking_url;
      }
    } else if (order.vendorType === VendorType.CJDROPSHIPPING) {
      const tracking = await cjDropshipping.getTracking(order.vendorOrderId);
      if (tracking.data) {
        trackingNumber = tracking.data.trackNumber;
        // CJ doesn't provide a tracking URL, construct one
        trackingUrl = `https://track.aftership.com/${trackingNumber}`;
      }
    }

    if (trackingNumber) {
      await db.order.update({
        where: { id: orderId },
        data: {
          trackingNumber,
          trackingUrl,
          status: 'SHIPPED',
          shippedAt: new Date(),
        },
      });

      return { success: true, trackingNumber, trackingUrl };
    }

    return { success: false, error: 'No tracking information available yet' };
  } catch (error) {
    console.error('[SYNC_TRACKING_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync tracking',
    };
  }
}
