import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (getApps().length === 0) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }
  const serviceAccount = JSON.parse(serviceAccountJson);
  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

// Collection names
const COLLECTIONS = {
  CATEGORIES: 'categories',
  TAGS: 'tags',
  PRODUCTS: 'products',
  DISCOUNT_CODES: 'discountCodes',
};

// Product status and vendor types
type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
type VendorType = 'PRINTFUL' | 'CJDROPSHIPPING' | 'ALIEXPRESS' | 'MANUAL';

interface ProductData {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  quantity: number;
  status: ProductStatus;
  featured: boolean;
  vendorType?: VendorType;
  images: string[];
  categoryId: string;
  tagIds: string[];
  variants?: {
    name: string;
    optionType: string;
    optionValue: string;
    price: number;
    inStock?: boolean;
  }[];
}

async function main() {
  console.log('Seeding Firebase Firestore...');

  // Create categories
  const categoriesData = [
    {
      name: 'Plushies',
      slug: 'plushies',
      description: 'Soft, huggable Bubu & Dudu plushies for every mood.',
      image: 'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
    },
    {
      name: 'Apparel',
      slug: 'apparel',
      description: 'Cozy fits for couples who match in style.',
      image: 'https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Everyday essentials that keep Bubu & Dudu close.',
      image: 'https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp',
    },
    {
      name: 'Home & Living',
      slug: 'home',
      description: 'Cozy home essentials featuring Bubu & Dudu.',
      image: 'https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp',
    },
    {
      name: 'Gift Sets',
      slug: 'gift-sets',
      description: 'Curated bundles for anniversaries, birthdays, and just because.',
      image: 'https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp',
    },
    {
      name: 'Matching Sets',
      slug: 'matching-sets',
      description: 'Couple-perfect outfits and bundles that pair together.',
      image: 'https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const existingQuery = await db.collection(COLLECTIONS.CATEGORIES).where('slug', '==', cat.slug).get();
    if (!existingQuery.empty) {
      categories[cat.slug] = existingQuery.docs[0].id;
      console.log(`Category "${cat.name}" already exists`);
    } else {
      const docRef = await db.collection(COLLECTIONS.CATEGORIES).add({
        ...cat,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      categories[cat.slug] = docRef.id;
      console.log(`Created category: ${cat.name}`);
    }
  }

  // Create tags
  const tagsData = [
    { name: 'Bestseller', slug: 'bestseller' },
    { name: 'New Arrival', slug: 'new-arrival' },
    { name: 'Sale', slug: 'sale' },
    { name: 'Couple', slug: 'couple' },
    { name: 'Gift', slug: 'gift' },
    { name: 'Matching', slug: 'matching' },
    { name: 'Cozy', slug: 'cozy' },
    { name: 'Anniversary', slug: 'anniversary' },
    { name: "Valentine's Day", slug: 'valentines' },
    { name: 'Birthday', slug: 'birthday' },
  ];

  const tags: Record<string, string> = {};
  for (const tag of tagsData) {
    const existingQuery = await db.collection(COLLECTIONS.TAGS).where('slug', '==', tag.slug).get();
    if (!existingQuery.empty) {
      tags[tag.slug] = existingQuery.docs[0].id;
      console.log(`Tag "${tag.name}" already exists`);
    } else {
      const docRef = await db.collection(COLLECTIONS.TAGS).add(tag);
      tags[tag.slug] = docRef.id;
      console.log(`Created tag: ${tag.name}`);
    }
  }

  // Create products
  const productsData: ProductData[] = [
    {
      name: 'Classic Bubu & Dudu Plush Set',
      slug: 'classic-plush-set',
      description: "The original Bubu & Dudu plushie set that started it all! These high-quality, ultra-soft plushies are perfect for cuddling. Bubu (the bear) and Dudu (the panda) are inseparable, just like you and your partner. Makes the perfect gift for anniversaries, Valentine's Day, or just because.",
      shortDescription: 'The iconic duo in plush form - perfect for couples!',
      price: 34.99,
      sku: 'DBB-PLUSH-001',
      quantity: 100,
      status: 'ACTIVE',
      featured: true,
      vendorType: 'CJDROPSHIPPING',
      images: [
        'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
        'https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp',
        'https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp',
      ],
      categoryId: categories['plushies'],
      tagIds: [tags['bestseller'], tags['couple'], tags['gift']],
    },
    {
      name: 'Matching Couple Hoodies',
      slug: 'matching-hoodies',
      description: 'Stay warm and cozy together with these adorable matching hoodies. Featuring Bubu on one and Dudu on the other, they complete each other when you stand next to your partner. Made from premium cotton blend for maximum comfort.',
      shortDescription: 'His & Hers matching hoodies - cute meets cozy!',
      price: 59.99,
      compareAtPrice: 79.99,
      sku: 'DBB-HOOD-001',
      quantity: 50,
      status: 'ACTIVE',
      featured: true,
      vendorType: 'PRINTFUL',
      images: [
        'https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif',
        'https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp',
      ],
      categoryId: categories['matching-sets'],
      tagIds: [tags['sale'], tags['couple'], tags['matching']],
      variants: [
        { name: 'S', optionType: 'size', optionValue: 'S', price: 59.99 },
        { name: 'M', optionType: 'size', optionValue: 'M', price: 59.99 },
        { name: 'L', optionType: 'size', optionValue: 'L', price: 59.99 },
        { name: 'XL', optionType: 'size', optionValue: 'XL', price: 59.99, inStock: false },
      ],
    },
    {
      name: 'Love Story Mug Set',
      slug: 'love-story-mugs',
      description: 'Start your mornings together with these adorable Bubu & Dudu mugs. The set includes two 11oz ceramic mugs with cute designs that complement each other perfectly. Microwave and dishwasher safe.',
      shortDescription: 'Two mugs that tell your love story!',
      price: 24.99,
      sku: 'DBB-MUG-001',
      quantity: 75,
      status: 'ACTIVE',
      featured: true,
      vendorType: 'PRINTFUL',
      images: [
        'https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp',
        'https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp',
      ],
      categoryId: categories['home'],
      tagIds: [tags['couple'], tags['gift']],
    },
    {
      name: 'Cute Panda Keychain',
      slug: 'panda-keychain',
      description: 'Take Dudu with you wherever you go! This adorable panda keychain is made from high-quality acrylic with a durable metal ring. Perfect for keys, bags, or backpacks.',
      shortDescription: 'Dudu goes wherever you go!',
      price: 12.99,
      sku: 'DBB-KEY-002',
      quantity: 200,
      status: 'ACTIVE',
      featured: true,
      vendorType: 'CJDROPSHIPPING',
      images: ['https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp'],
      categoryId: categories['accessories'],
      tagIds: [tags['bestseller']],
    },
    {
      name: 'Panda Pajama Set',
      slug: 'panda-pajamas',
      description: 'Get cozy for bedtime with this super soft panda-themed pajama set. Features an all-over print of sleepy Bubu & Dudu. Made from breathable cotton blend for comfortable sleep.',
      shortDescription: 'Sweet dreams in the coziest PJs!',
      price: 45.99,
      sku: 'DBB-PJ-001',
      quantity: 40,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'PRINTFUL',
      images: [
        'https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp',
        'https://media.tenor.com/oPHqTKxUDo4AAAAm/bubu-dudu-sleep-funny-bubu-dudu-love.webp',
      ],
      categoryId: categories['apparel'],
      tagIds: [tags['cozy'], tags['couple']],
      variants: [
        { name: 'S', optionType: 'size', optionValue: 'S', price: 45.99 },
        { name: 'M', optionType: 'size', optionValue: 'M', price: 45.99 },
        { name: 'L', optionType: 'size', optionValue: 'L', price: 45.99 },
      ],
    },
    {
      name: 'Heart Pillow',
      slug: 'heart-pillow',
      description: 'A cuddly heart-shaped pillow featuring Bubu & Dudu hugging. Perfect for decorating your bedroom or couch. Made with super soft plush material.',
      shortDescription: 'Hug your heart out with this plush pillow!',
      price: 29.99,
      sku: 'DBB-PIL-001',
      quantity: 60,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'CJDROPSHIPPING',
      images: [
        'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
        'https://media.tenor.com/skrULsl5twcAAAAm/bubududukiwi-twitter.webp',
      ],
      categoryId: categories['home'],
      tagIds: [tags['gift'], tags['cozy']],
    },
    {
      name: 'Couple T-Shirts Set',
      slug: 'couple-tshirts',
      description: 'Show your love with these matching couple t-shirts! Bubu on one, Dudu on the other - together you complete the picture. 100% cotton, pre-shrunk.',
      shortDescription: 'Complete the picture together!',
      price: 39.99,
      sku: 'DBB-TEE-001',
      quantity: 80,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'PRINTFUL',
      images: ['https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp'],
      categoryId: categories['apparel'],
      tagIds: [tags['couple'], tags['matching']],
      variants: [
        { name: 'S', optionType: 'size', optionValue: 'S', price: 39.99 },
        { name: 'M', optionType: 'size', optionValue: 'M', price: 39.99 },
        { name: 'L', optionType: 'size', optionValue: 'L', price: 39.99 },
        { name: 'XL', optionType: 'size', optionValue: 'XL', price: 39.99 },
      ],
    },
    {
      name: 'Phone Case Duo',
      slug: 'phone-case-duo',
      description: 'Protect your phone in style with these matching phone cases. Available for most iPhone and Samsung models. Hard shell with glossy finish.',
      shortDescription: 'Style and protection in one!',
      price: 19.99,
      sku: 'DBB-CASE-001',
      quantity: 120,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'PRINTFUL',
      images: ['https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp'],
      categoryId: categories['accessories'],
      tagIds: [tags['couple']],
    },
    {
      name: 'Cozy Fleece Blanket',
      slug: 'fleece-blanket',
      description: 'Wrap yourselves in love with this ultra-soft fleece blanket. Features an adorable Bubu & Dudu design. Perfect for movie nights and cuddle sessions. Size: 50" x 60".',
      shortDescription: 'The coziest cuddle companion!',
      price: 49.99,
      sku: 'DBB-BLNK-001',
      quantity: 35,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'PRINTFUL',
      images: ['https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp'],
      categoryId: categories['home'],
      tagIds: [tags['cozy'], tags['gift']],
    },
    {
      name: 'Bear Keychain',
      slug: 'bear-keychain',
      description: 'Bring Bubu with you everywhere! This cute bear keychain matches perfectly with the Panda Keychain. Made from high-quality acrylic with a durable metal ring.',
      shortDescription: 'Bubu goes wherever you go!',
      price: 12.99,
      sku: 'DBB-KEY-001',
      quantity: 200,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'CJDROPSHIPPING',
      images: ['https://media.tenor.com/cwNYjFIdTZ4AAAAm/bubu-cute-bubu-dudu.webp'],
      categoryId: categories['accessories'],
      tagIds: [tags['bestseller']],
    },
    {
      name: 'Anniversary Gift Box',
      slug: 'anniversary-gift-box',
      description: 'A curated gift box with plushies, matching keychains, and a handwritten note to celebrate your special day.',
      shortDescription: 'The ultimate anniversary surprise!',
      price: 74.99,
      sku: 'DBB-GIFT-001',
      quantity: 25,
      status: 'ACTIVE',
      featured: false,
      vendorType: 'MANUAL',
      images: [
        'https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp',
        'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
      ],
      categoryId: categories['gift-sets'],
      tagIds: [tags['gift'], tags['couple']],
    },
    {
      name: 'Matching Date Night Bundle',
      slug: 'matching-date-night-bundle',
      description: 'Matching hoodie + blanket combo for cozy date nights. Includes an exclusive love note from Bubu & Dudu.',
      shortDescription: 'Everything you need for the perfect date night!',
      price: 89.99,
      compareAtPrice: 109.99,
      sku: 'DBB-BUND-001',
      quantity: 20,
      status: 'ACTIVE',
      featured: true,
      vendorType: 'MANUAL',
      images: [
        'https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp',
        'https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp',
      ],
      categoryId: categories['matching-sets'],
      tagIds: [tags['sale'], tags['matching'], tags['couple']],
    },
  ];

  for (const productData of productsData) {
    const { variants, categoryId, tagIds, images, ...data } = productData;

    // Check if product exists
    const existingQuery = await db.collection(COLLECTIONS.PRODUCTS).where('slug', '==', data.slug).get();
    if (!existingQuery.empty) {
      console.log(`Product "${data.name}" already exists, skipping...`);
      continue;
    }

    // Create product with denormalized images
    const productImages = images.map((url, index) => ({
      id: `img_${index}`,
      url,
      alt: `${data.name} - Image ${index + 1}`,
      position: index,
    }));

    const productRef = await db.collection(COLLECTIONS.PRODUCTS).add({
      ...data,
      images: productImages,
      categoryIds: [categoryId],
      tagIds: tagIds,
      trackInventory: true,
      lowStockAlert: 5,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Create variants as subcollection
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await productRef.collection('variants').add({
          ...variant,
          productId: productRef.id,
          sku: `${data.sku}-${variant.optionValue}`,
          quantity: variant.inStock === false ? 0 : 20,
          inStock: variant.inStock !== false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    console.log(`Created product: ${data.name}`);
  }

  // Create discount codes
  const discountCodes = [
    {
      code: 'WELCOME10',
      description: '10% off for new customers',
      type: 'PERCENTAGE',
      value: 10,
      active: true,
      usedCount: 0,
    },
    {
      code: 'LOVE20',
      description: "20% off for Valentine's Day",
      type: 'PERCENTAGE',
      value: 20,
      minOrderAmount: 50,
      active: true,
      usedCount: 0,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on any order',
      type: 'FREE_SHIPPING',
      value: 0,
      active: true,
      usedCount: 0,
    },
  ];

  for (const discount of discountCodes) {
    const existingQuery = await db.collection(COLLECTIONS.DISCOUNT_CODES).where('code', '==', discount.code).get();
    if (!existingQuery.empty) {
      console.log(`Discount code "${discount.code}" already exists`);
      continue;
    }
    await db.collection(COLLECTIONS.DISCOUNT_CODES).add({
      ...discount,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Created discount code: ${discount.code}`);
  }

  console.log('Firebase Firestore seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding Firestore:', e);
    process.exit(1);
  });
