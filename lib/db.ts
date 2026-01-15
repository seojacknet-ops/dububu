import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { FieldValue, Query, DocumentData, QuerySnapshot } from 'firebase-admin/firestore';
import type {
  User,
  Product,
  Category,
  Tag,
  Order,
  OrderItem,
  DiscountCode,
  NewsletterSubscriber,
  ContactSubmission,
  ProductVariant,
} from '@/lib/firebase/types';

// Helper to convert Firestore documents
function docToData<T>(doc: FirebaseFirestore.DocumentSnapshot): T | null {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function docsToData<T>(snapshot: QuerySnapshot<DocumentData>): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

// ==========================================
// USER OPERATIONS
// ==========================================

export const db = {
  // User operations
  user: {
    async findUnique(args: { where: { id?: string; email?: string } }): Promise<User | null> {
      const firestore = adminDb();
      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.USERS).doc(args.where.id).get();
        return docToData<User>(doc);
      }
      if (args.where.email) {
        const snapshot = await firestore
          .collection(COLLECTIONS.USERS)
          .where('email', '==', args.where.email)
          .limit(1)
          .get();
        return snapshot.empty ? null : docsToData<User>(snapshot)[0];
      }
      return null;
    },

    async findMany(args?: {
      where?: Partial<User>;
      orderBy?: { [K in keyof User]?: 'asc' | 'desc' };
      take?: number;
    }): Promise<User[]> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.USERS);

      if (args?.where) {
        Object.entries(args.where).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
      }

      if (args?.orderBy) {
        Object.entries(args.orderBy).forEach(([key, direction]) => {
          query = query.orderBy(key, direction);
        });
      }

      if (args?.take) {
        query = query.limit(args.take);
      }

      const snapshot = await query.get();
      return docsToData<User>(snapshot);
    },

    async create(args: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }): Promise<User> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.USERS).doc();
      const userData = {
        ...args.data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await docRef.set(userData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as User;
    },

    async update(args: { where: { id: string }; data: Partial<User> }): Promise<User> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.USERS).doc(args.where.id);
      await docRef.update({
        ...args.data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as User;
    },

    async delete(args: { where: { id: string } }): Promise<void> {
      const firestore = adminDb();
      await firestore.collection(COLLECTIONS.USERS).doc(args.where.id).delete();
    },

    async count(args?: { where?: Partial<User> }): Promise<number> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.USERS);

      if (args?.where) {
        Object.entries(args.where).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    },
  },

  // Product operations
  product: {
    async findUnique(args: { where: { id?: string; slug?: string; sku?: string }; include?: { variants?: boolean } }): Promise<(Product & { variants?: ProductVariant[] }) | null> {
      const firestore = adminDb();
      let product: Product | null = null;

      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.PRODUCTS).doc(args.where.id).get();
        product = docToData<Product>(doc);
      } else if (args.where.slug) {
        const snapshot = await firestore
          .collection(COLLECTIONS.PRODUCTS)
          .where('slug', '==', args.where.slug)
          .limit(1)
          .get();
        product = snapshot.empty ? null : docsToData<Product>(snapshot)[0];
      } else if (args.where.sku) {
        const snapshot = await firestore
          .collection(COLLECTIONS.PRODUCTS)
          .where('sku', '==', args.where.sku)
          .limit(1)
          .get();
        product = snapshot.empty ? null : docsToData<Product>(snapshot)[0];
      }

      if (product && args.include?.variants) {
        const variantsSnapshot = await firestore
          .collection(COLLECTIONS.PRODUCTS)
          .doc(product.id)
          .collection('variants')
          .get();
        return { ...product, variants: docsToData<ProductVariant>(variantsSnapshot) };
      }

      return product;
    },

    async findMany(args?: {
      where?: Partial<Product> & { status?: string; categoryIds?: { has: string } };
      orderBy?: { [K in keyof Product]?: 'asc' | 'desc' };
      take?: number;
      include?: { variants?: boolean };
    }): Promise<(Product & { variants?: ProductVariant[] })[]> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.PRODUCTS);

      if (args?.where) {
        const { categoryIds, ...restWhere } = args.where;
        Object.entries(restWhere).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
        if (categoryIds?.has) {
          query = query.where('categoryIds', 'array-contains', categoryIds.has);
        }
      }

      if (args?.orderBy) {
        Object.entries(args.orderBy).forEach(([key, direction]) => {
          query = query.orderBy(key, direction);
        });
      }

      if (args?.take) {
        query = query.limit(args.take);
      }

      const snapshot = await query.get();
      const products = docsToData<Product>(snapshot);

      if (args?.include?.variants) {
        return Promise.all(
          products.map(async (product) => {
            const variantsSnapshot = await firestore
              .collection(COLLECTIONS.PRODUCTS)
              .doc(product.id)
              .collection('variants')
              .get();
            return { ...product, variants: docsToData<ProductVariant>(variantsSnapshot) };
          })
        );
      }

      return products;
    },

    async create(args: { data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { variants?: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>[] } }): Promise<Product> {
      const firestore = adminDb();
      const { variants, ...productData } = args.data;
      const docRef = firestore.collection(COLLECTIONS.PRODUCTS).doc();
      const product = {
        ...productData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await docRef.set(product);

      // Create variants as subcollection
      if (variants && variants.length > 0) {
        const batch = firestore.batch();
        variants.forEach((variant) => {
          const variantRef = docRef.collection('variants').doc();
          batch.set(variantRef, {
            ...variant,
            productId: docRef.id,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
      }

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Product;
    },

    async update(args: { where: { id: string }; data: Partial<Product> }): Promise<Product> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.PRODUCTS).doc(args.where.id);
      await docRef.update({
        ...args.data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Product;
    },

    async delete(args: { where: { id: string } }): Promise<void> {
      const firestore = adminDb();
      await firestore.collection(COLLECTIONS.PRODUCTS).doc(args.where.id).delete();
    },

    async count(args?: { where?: Partial<Product> }): Promise<number> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.PRODUCTS);

      if (args?.where) {
        Object.entries(args.where).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    },
  },

  // Category operations
  category: {
    async findUnique(args: { where: { id?: string; slug?: string } }): Promise<Category | null> {
      const firestore = adminDb();
      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.CATEGORIES).doc(args.where.id).get();
        return docToData<Category>(doc);
      }
      if (args.where.slug) {
        const snapshot = await firestore
          .collection(COLLECTIONS.CATEGORIES)
          .where('slug', '==', args.where.slug)
          .limit(1)
          .get();
        return snapshot.empty ? null : docsToData<Category>(snapshot)[0];
      }
      return null;
    },

    async findMany(args?: {
      orderBy?: { [K in keyof Category]?: 'asc' | 'desc' };
      take?: number;
    }): Promise<Category[]> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.CATEGORIES);

      if (args?.orderBy) {
        Object.entries(args.orderBy).forEach(([key, direction]) => {
          query = query.orderBy(key, direction);
        });
      }

      if (args?.take) {
        query = query.limit(args.take);
      }

      const snapshot = await query.get();
      return docsToData<Category>(snapshot);
    },

    async upsert(args: { where: { slug: string }; update: Partial<Category>; create: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> }): Promise<Category> {
      const firestore = adminDb();
      const snapshot = await firestore
        .collection(COLLECTIONS.CATEGORIES)
        .where('slug', '==', args.where.slug)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({
          ...args.update,
          updatedAt: FieldValue.serverTimestamp(),
        });
        const updated = await doc.ref.get();
        return { id: updated.id, ...updated.data() } as Category;
      }

      const docRef = firestore.collection(COLLECTIONS.CATEGORIES).doc();
      await docRef.set({
        ...args.create,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Category;
    },
  },

  // Tag operations
  tag: {
    async findUnique(args: { where: { id?: string; slug?: string } }): Promise<Tag | null> {
      const firestore = adminDb();
      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.TAGS).doc(args.where.id).get();
        return docToData<Tag>(doc);
      }
      if (args.where.slug) {
        const snapshot = await firestore
          .collection(COLLECTIONS.TAGS)
          .where('slug', '==', args.where.slug)
          .limit(1)
          .get();
        return snapshot.empty ? null : docsToData<Tag>(snapshot)[0];
      }
      return null;
    },

    async findMany(): Promise<Tag[]> {
      const firestore = adminDb();
      const snapshot = await firestore.collection(COLLECTIONS.TAGS).get();
      return docsToData<Tag>(snapshot);
    },

    async upsert(args: { where: { slug: string }; update: Partial<Tag>; create: Omit<Tag, 'id'> }): Promise<Tag> {
      const firestore = adminDb();
      const snapshot = await firestore
        .collection(COLLECTIONS.TAGS)
        .where('slug', '==', args.where.slug)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        if (Object.keys(args.update).length > 0) {
          await doc.ref.update(args.update);
        }
        const updated = await doc.ref.get();
        return { id: updated.id, ...updated.data() } as Tag;
      }

      const docRef = firestore.collection(COLLECTIONS.TAGS).doc();
      await docRef.set(args.create);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Tag;
    },
  },

  // Order operations
  order: {
    async findUnique(args: { where: { id?: string; orderNumber?: string }; include?: { items?: boolean } }): Promise<Order | null> {
      const firestore = adminDb();
      let order: Order | null = null;

      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.ORDERS).doc(args.where.id).get();
        order = docToData<Order>(doc);
      } else if (args.where.orderNumber) {
        const snapshot = await firestore
          .collection(COLLECTIONS.ORDERS)
          .where('orderNumber', '==', args.where.orderNumber)
          .limit(1)
          .get();
        order = snapshot.empty ? null : docsToData<Order>(snapshot)[0];
      }

      return order;
    },

    async findFirst(args: { where: Partial<Order> }): Promise<Order | null> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.ORDERS);

      Object.entries(args.where).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.where(key, '==', value);
        }
      });

      const snapshot = await query.limit(1).get();
      return snapshot.empty ? null : docsToData<Order>(snapshot)[0];
    },

    async findMany(args?: {
      where?: Partial<Order>;
      orderBy?: { [K in keyof Order]?: 'asc' | 'desc' };
      take?: number;
      include?: { items?: boolean };
    }): Promise<Order[]> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.ORDERS);

      if (args?.where) {
        Object.entries(args.where).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
      }

      if (args?.orderBy) {
        Object.entries(args.orderBy).forEach(([key, direction]) => {
          query = query.orderBy(key, direction);
        });
      }

      if (args?.take) {
        query = query.limit(args.take);
      }

      const snapshot = await query.get();
      return docsToData<Order>(snapshot);
    },

    async create(args: {
      data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & {
        items?: { create: Omit<OrderItem, 'id'>[] };
      };
      include?: { items?: boolean };
    }): Promise<Order> {
      const firestore = adminDb();
      const { items, ...orderData } = args.data;
      const docRef = firestore.collection(COLLECTIONS.ORDERS).doc();

      // Items are stored directly in the order document
      const orderItems = items?.create || [];

      await docRef.set({
        ...orderData,
        items: orderItems.map((item, index) => ({ ...item, id: `item_${index}` })),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Order;
    },

    async update(args: { where: { id: string }; data: Partial<Order> }): Promise<Order> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.ORDERS).doc(args.where.id);
      await docRef.update({
        ...args.data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Order;
    },

    async count(args?: { where?: Partial<Order> }): Promise<number> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.ORDERS);

      if (args?.where) {
        Object.entries(args.where).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.where(key, '==', value);
          }
        });
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    },
  },

  // Discount Code operations
  discountCode: {
    async findUnique(args: { where: { id?: string; code?: string } }): Promise<DiscountCode | null> {
      const firestore = adminDb();
      if (args.where.id) {
        const doc = await firestore.collection(COLLECTIONS.DISCOUNT_CODES).doc(args.where.id).get();
        return docToData<DiscountCode>(doc);
      }
      if (args.where.code) {
        const snapshot = await firestore
          .collection(COLLECTIONS.DISCOUNT_CODES)
          .where('code', '==', args.where.code)
          .limit(1)
          .get();
        return snapshot.empty ? null : docsToData<DiscountCode>(snapshot)[0];
      }
      return null;
    },

    async upsert(args: {
      where: { code: string };
      update: Partial<DiscountCode>;
      create: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt'>;
    }): Promise<DiscountCode> {
      const firestore = adminDb();
      const snapshot = await firestore
        .collection(COLLECTIONS.DISCOUNT_CODES)
        .where('code', '==', args.where.code)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({
          ...args.update,
          updatedAt: FieldValue.serverTimestamp(),
        });
        const updated = await doc.ref.get();
        return { id: updated.id, ...updated.data() } as DiscountCode;
      }

      const docRef = firestore.collection(COLLECTIONS.DISCOUNT_CODES).doc();
      await docRef.set({
        ...args.create,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as DiscountCode;
    },
  },

  // Contact Submission operations
  contactSubmission: {
    async create(args: { data: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt'> }): Promise<ContactSubmission> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.CONTACT_SUBMISSIONS).doc();
      await docRef.set({
        ...args.data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as ContactSubmission;
    },

    async findMany(args?: {
      orderBy?: { [K in keyof ContactSubmission]?: 'asc' | 'desc' };
      take?: number;
    }): Promise<ContactSubmission[]> {
      const firestore = adminDb();
      let query: Query<DocumentData> = firestore.collection(COLLECTIONS.CONTACT_SUBMISSIONS);

      if (args?.orderBy) {
        Object.entries(args.orderBy).forEach(([key, direction]) => {
          query = query.orderBy(key, direction);
        });
      }

      if (args?.take) {
        query = query.limit(args.take);
      }

      const snapshot = await query.get();
      return docsToData<ContactSubmission>(snapshot);
    },
  },

  // Newsletter Subscriber operations
  newsletterSubscriber: {
    async create(args: { data: Omit<NewsletterSubscriber, 'id' | 'createdAt' | 'updatedAt'> }): Promise<NewsletterSubscriber> {
      const firestore = adminDb();
      const docRef = firestore.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc();
      await docRef.set({
        ...args.data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as NewsletterSubscriber;
    },

    async findUnique(args: { where: { email: string } }): Promise<NewsletterSubscriber | null> {
      const firestore = adminDb();
      const snapshot = await firestore
        .collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
        .where('email', '==', args.where.email)
        .limit(1)
        .get();
      return snapshot.empty ? null : docsToData<NewsletterSubscriber>(snapshot)[0];
    },
  },
};

export default db;
