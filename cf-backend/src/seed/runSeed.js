const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const slugify = require('../utils/slugify');
const categoriesData = require('./data/categories');
const subcategoriesData = require('./data/subcategories');
const brandsData = require('./data/brands');
const vendorsData = require('./data/vendors');
const collectionsData = require('./data/collections');
const productsData = require('./data/products');
const blogTagsData = require('./data/blogTags');
const postsData = require('./data/posts');
const testimonialsData = require('./data/testimonials');
const usersData = require('./data/users');
const imageUrls = require('./imageUrls');

const SEED_FORCE = process.env.SEED_FORCE === 'true';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
const DEFAULT_USER_PASSWORD = 'Password123!';

// Shared refs populated during seed (slug -> id maps)
const refs = {
  categories: {},
  subcategories: {},
  brands: {},
  vendors: {},
  collections: {},
  products: {},
  blogTags: {},
  users: {}
};

function log(phase, message) {
  // eslint-disable-next-line no-console
  console.log(`[${phase}] ${message}`);
}

function ensureUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  existingSlugs.add(slug);
  return slug;
}

async function seedUsers() {
  log('Users', 'Seeding users...');
  const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
  const userPasswordHash = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@interior.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@interior.com',
      passwordHash,
      role: 'ADMIN'
    }
  });
  refs.users['admin@interior.com'] = admin.id;

  for (const u of usersData) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: userPasswordHash,
        role: 'USER'
      }
    });
    refs.users[u.email] = created.id;
  }
  log('Users', `Seeded ${Object.keys(refs.users).length} users`);
}

async function seedCategories() {
  log('Categories', 'Seeding categories...');
  for (const c of categoriesData) {
    const slug = slugify(c.name);
    const created = await prisma.category.upsert({
      where: { slug },
      update: {
        name: c.name,
        description: c.description || null,
        imageUrl: c.imageUrl || null,
        showInHeader: c.showInHeader || false,
        headerOrder: c.headerOrder ?? null
      },
      create: {
        name: c.name,
        slug,
        description: c.description || null,
        imageUrl: c.imageUrl || null,
        showInHeader: c.showInHeader || false,
        headerOrder: c.headerOrder ?? null
      }
    });
    refs.categories[c.name] = created.id;
  }
  log('Categories', `Seeded ${categoriesData.length} categories`);
}

async function seedSubcategories() {
  log('Subcategories', 'Seeding subcategories...');
  const slugSet = new Set();
  for (const [categoryName, subNames] of Object.entries(subcategoriesData)) {
    const categoryId = refs.categories[categoryName];
    if (!categoryId) continue;
    for (const name of subNames) {
      const baseSlug = slugify(name);
      const slug = ensureUniqueSlug(baseSlug, slugSet);
      const created = await prisma.subCategory.upsert({
        where: { slug },
        update: { name, categoryId },
        create: { name, slug, categoryId }
      });
      refs.subcategories[name] = created.id;
    }
  }
  log('Subcategories', `Seeded ${Object.keys(refs.subcategories).length} subcategories`);
}

async function seedBrands() {
  log('Brands', 'Seeding brands...');
  for (const b of brandsData) {
    const slug = slugify(b.name);
    const created = await prisma.brand.upsert({
      where: { slug },
      update: { name: b.name, description: b.description || null },
      create: { name: b.name, slug, description: b.description || null }
    });
    refs.brands[b.name] = created.id;
  }
  log('Brands', `Seeded ${brandsData.length} brands`);
}

async function seedVendors() {
  log('Vendors', 'Seeding vendors...');
  for (const v of vendorsData) {
    const slug = slugify(v.name);
    const created = await prisma.vendor.upsert({
      where: { slug },
      update: { name: v.name, description: v.description || null },
      create: { name: v.name, slug, description: v.description || null }
    });
    refs.vendors[v.name] = created.id;
  }
  log('Vendors', `Seeded ${vendorsData.length} vendors`);
}

async function seedCollections() {
  log('Collections', 'Seeding collections...');
  for (const c of collectionsData) {
    const slug = slugify(c.name);
    const created = await prisma.collection.upsert({
      where: { slug },
      update: { name: c.name, description: c.description || null },
      create: { name: c.name, slug, description: c.description || null }
    });
    refs.collections[c.name] = created.id;
  }
  log('Collections', `Seeded ${collectionsData.length} collections`);
}

async function seedProducts() {
  log('Products', 'Seeding products...');
  const slugSet = new Set();
  const vendorNames = Object.keys(refs.vendors);
  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const categoryId = refs.categories[p.category];
    const subCategoryId = refs.subcategories[p.subcategory];
    if (!categoryId || !subCategoryId) {
      log('Products', `Skipping product "${p.name}" - missing category/subcategory`);
      continue;
    }
    const baseSlug = slugify(p.name);
    const slug = ensureUniqueSlug(baseSlug, slugSet);
    const brandId = p.brand ? refs.brands[p.brand] : null;
    const collectionId = p.collection ? refs.collections[p.collection] : null;
    const vendorId = p.vendor ? refs.vendors[p.vendor] : (i % 3 === 0 && vendorNames.length ? refs.vendors[vendorNames[i % vendorNames.length]] : null);
    const created = await prisma.product.upsert({
      where: { slug },
      update: {
        name: p.name,
        description: p.description || null,
        priceCents: p.priceCents,
        categoryId,
        subCategoryId,
        brandId,
        vendorId,
        collectionId,
        isNewArrival: p.isNewArrival || false
      },
      create: {
        name: p.name,
        slug,
        description: p.description || null,
        priceCents: p.priceCents,
        categoryId,
        subCategoryId,
        brandId,
        vendorId,
        collectionId,
        isNewArrival: p.isNewArrival || false
      }
    });
    refs.products[p.name] = created.id;
  }
  log('Products', `Seeded ${Object.keys(refs.products).length} products`);
}

async function seedProductImagesSimple() {
  log('ProductImages', 'Seeding product images...');
  const productEntries = Object.entries(refs.products);
  let count = 0;
  for (let i = 0; i < productEntries.length; i++) {
    const [productName, productId] = productEntries[i];
    const url = imageUrls[i % imageUrls.length];
    const existing = await prisma.productImage.findFirst({
      where: { productId, isCover: true }
    });
    if (!existing) {
      await prisma.productImage.create({
        data: {
          url,
          altText: productName,
          isCover: true,
          productId
        }
      });
      count++;
    }
  }
  log('ProductImages', `Seeded ${count} product images`);
}

async function seedBlogTags() {
  log('BlogTags', 'Seeding blog tags...');
  for (const name of blogTagsData) {
    const slug = slugify(name);
    const created = await prisma.blogTag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
    refs.blogTags[name] = created.id;
  }
  log('BlogTags', `Seeded ${blogTagsData.length} blog tags`);
}

async function seedPosts() {
  log('Posts', 'Seeding posts...');
  for (const p of postsData) {
    const categoryId = refs.categories[p.category];
    if (!categoryId) continue;
    const publishedAt = p.isPublished ? new Date() : null;
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary || null,
        content: p.content,
        categoryId,
        isPublished: p.isPublished,
        publishedAt
      },
      create: {
        title: p.title,
        slug: p.slug,
        summary: p.summary || null,
        content: p.content,
        categoryId,
        isPublished: p.isPublished,
        publishedAt
      }
    });
  }
  log('Posts', `Seeded ${postsData.length} posts`);
}

async function seedPostTags() {
  log('PostTags', 'Seeding post tags...');
  for (const p of postsData) {
    if (!p.tags || !p.tags.length) continue;
    const post = await prisma.post.findUnique({ where: { slug: p.slug } });
    if (!post) continue;
    for (const tagName of p.tags) {
      const tagId = refs.blogTags[tagName];
      if (!tagId) continue;
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId } },
        update: {},
        create: { postId: post.id, tagId }
      });
    }
  }
  log('PostTags', 'Post tags linked');
}

async function seedTestimonialsSimple() {
  log('Testimonials', 'Seeding testimonials...');
  const existing = await prisma.testimonial.count();
  if (existing >= testimonialsData.length && !SEED_FORCE) {
    log('Testimonials', 'Skipping (already seeded)');
    return;
  }
  for (const t of testimonialsData) {
    const found = await prisma.testimonial.findFirst({
      where: { name: t.name, content: t.content }
    });
    if (!found) {
      await prisma.testimonial.create({
        data: { name: t.name, role: t.role || null, content: t.content }
      });
    }
  }
  log('Testimonials', `Seeded testimonials`);
}

async function seedCartsAndItems() {
  log('Carts', 'Seeding carts and cart items...');
  const customerEmails = usersData.slice(0, 5).map((u) => u.email);
  const productIds = Object.values(refs.products);
  if (productIds.length < 5) return;
  for (const email of customerEmails) {
    const userId = refs.users[email];
    if (!userId) continue;
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    const existingItems = await prisma.cartItem.count({ where: { cartId: cart.id } });
    if (existingItems > 0 && !SEED_FORCE) continue;
    if (existingItems > 0 && SEED_FORCE) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    const product = await prisma.product.findUnique({
      where: { id: productIds[0] },
      select: { priceCents: true }
    });
    if (product) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productIds[0],
          quantity: 2,
          unitPriceCents: product.priceCents
        }
      });
    }
    for (let j = 1; j < Math.min(4, productIds.length); j++) {
      const prod = await prisma.product.findUnique({
        where: { id: productIds[j] },
        select: { priceCents: true }
      });
      if (prod) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productIds[j],
            quantity: 1,
            unitPriceCents: prod.priceCents
          }
        });
      }
    }
  }
  log('Carts', 'Carts and items seeded');
}

async function seedOrdersAndItems() {
  log('Orders', 'Seeding orders and order items...');
  const orderCount = await prisma.order.count();
  if (orderCount >= 5 && !SEED_FORCE) {
    log('Orders', 'Skipping (already seeded)');
    return;
  }
  const customerEmails = usersData.slice(0, 8).map((u) => u.email);
  const productIds = Object.values(refs.products);
  const statuses = ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED', 'REFUNDED'];
  for (let i = 0; i < 8; i++) {
    const email = customerEmails[i % customerEmails.length];
    const userId = refs.users[email];
    if (!userId) continue;
    const orderNumber = `ORD-2024-${String(1000 + i).padStart(4, '0')}`;
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (existing) continue;
    const status = statuses[i % statuses.length];
    const items = [];
    for (let j = 0; j < 3; j++) {
      const pid = productIds[(i * 3 + j) % productIds.length];
      const prod = await prisma.product.findUnique({
        where: { id: pid },
        select: { name: true, priceCents: true }
      });
      if (prod) {
        const qty = 1 + (j % 2);
        items.push({
          productId: pid,
          productName: prod.name,
          quantity: qty,
          unitPriceCents: prod.priceCents,
          totalCents: qty * prod.priceCents
        });
      }
    }
    if (items.length === 0) continue;
    const subtotalCents = items.reduce((s, it) => s + it.totalCents, 0);
    const taxCents = Math.round(subtotalCents * 0.08);
    const totalCents = subtotalCents + taxCents;
    await prisma.order.create({
      data: {
        userId,
        orderNumber,
        status,
        subtotalCents,
        taxCents,
        totalCents,
        items: { create: items },
        ...(status === 'FULFILLED' ? { fulfilledAt: new Date() } : {}),
        ...(status === 'REFUNDED' ? { refundedAt: new Date(), refundedAmountCents: totalCents } : {}),
        ...(status === 'CANCELLED' ? { cancelledAt: new Date() } : {})
      }
    });
  }
  log('Orders', 'Orders and items seeded');
}

async function seedQuotesAndItems() {
  log('Quotes', 'Seeding quotes and quote items...');
  const quoteCount = await prisma.quote.count();
  if (quoteCount >= 4 && !SEED_FORCE) {
    log('Quotes', 'Skipping (already seeded)');
    return;
  }
  const customerEmails = usersData.slice(0, 6).map((u) => u.email);
  const productIds = Object.values(refs.products);
  const statuses = ['PENDING', 'PENDING', 'SENT', 'SENT', 'ACCEPTED', 'REJECTED'];
  for (let i = 0; i < 6; i++) {
    const email = customerEmails[i % customerEmails.length];
    const userId = refs.users[email];
    if (!userId) continue;
    const status = statuses[i];
    const items = [];
    for (let j = 0; j < 2; j++) {
      const pid = productIds[(i * 5 + j) % productIds.length];
      items.push({ productId: pid, quantity: 1 + (j % 2) });
    }
    const quote = await prisma.quote.create({
      data: {
        userId,
        status,
        notes: i % 2 === 0 ? 'Please include delivery estimate' : null,
        sentAt: status === 'SENT' || status === 'ACCEPTED' || status === 'REJECTED' ? new Date() : null,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity
          }))
        }
      }
    });
  }
  log('Quotes', 'Quotes and items seeded');
}

async function seedInvoicesAndItems() {
  log('Invoices', 'Seeding invoices and invoice items...');
  const invoiceCount = await prisma.invoice.count();
  if (invoiceCount >= 4 && !SEED_FORCE) {
    log('Invoices', 'Skipping (already seeded)');
    return;
  }
  const customerEmails = usersData.slice(0, 6).map((u) => u.email);
  const productIds = Object.values(refs.products);
  const statuses = ['DRAFT', 'PENDING', 'SENT', 'PAID'];
  for (let i = 0; i < 6; i++) {
    const email = customerEmails[i % customerEmails.length];
    const userId = refs.users[email];
    if (!userId) continue;
    const invoiceNumber = `INV-2024-${String(1000 + i).padStart(4, '0')}`;
    const existing = await prisma.invoice.findUnique({ where: { invoiceNumber } });
    if (existing) continue;
    const status = statuses[i % statuses.length];
    const items = [];
    for (let j = 0; j < 2; j++) {
      const pid = productIds[(i * 7 + j) % productIds.length];
      const prod = await prisma.product.findUnique({
        where: { id: pid },
        select: { priceCents: true }
      });
      if (prod) {
        const qty = 1 + (j % 2);
        items.push({
          productId: pid,
          quantity: qty,
          unitPriceCents: prod.priceCents,
          totalCents: qty * prod.priceCents
        });
      }
    }
    if (items.length === 0) continue;
    const totalCents = items.reduce((s, it) => s + it.totalCents, 0);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        status,
        totalCents,
        dueDate,
        paidAt: status === 'PAID' ? new Date() : null,
        items: { create: items }
      }
    });
  }
  log('Invoices', 'Invoices and items seeded');
}

async function seedReviews() {
  log('Reviews', 'Seeding reviews...');
  const reviewCount = await prisma.review.count();
  if (reviewCount >= 20 && !SEED_FORCE) {
    log('Reviews', 'Skipping (already seeded)');
    return;
  }
  const customerEmails = usersData.map((u) => u.email);
  const productIds = Object.values(refs.products);
  const comments = [
    'Beautiful piece, exactly as described. Very happy with the quality.',
    'Arrived on time and well packaged. Fits perfectly in our space.',
    'Great value for the price. Would recommend to friends.',
    'Sturdy and well-made. Matches our existing furniture.',
    'Love it! The finish is even nicer in person.',
    'Perfect for our living room. Gets lots of compliments.',
    'Solid construction. Exactly what we were looking for.',
    'Quick delivery. Assembly was straightforward.',
    'Exceeded expectations. Will buy from here again.',
    'Nice design, good quality. Happy with the purchase.'
  ];
  const statuses = ['PENDING', 'APPROVED', 'APPROVED', 'APPROVED', 'REJECTED'];
  let added = 0;
  for (let i = 0; i < 30 && added < 30; i++) {
    const email = customerEmails[i % customerEmails.length];
    const userId = refs.users[email];
    const productId = productIds[i % productIds.length];
    if (!userId || !productId) continue;
    const existing = await prisma.review.findFirst({
      where: { userId, productId }
    });
    if (existing) continue;
    await prisma.review.create({
      data: {
        userId,
        productId,
        rating: 3 + (i % 3),
        comment: comments[i % comments.length],
        status: statuses[i % statuses.length]
      }
    });
    added++;
  }
  log('Reviews', `Seeded ${added} reviews`);
}

async function seedRefreshTokens() {
  log('RefreshTokens', 'Skipping (ephemeral, not required for seed)');
}

async function runSeed() {
  log('Seed', 'Starting full database seed...');
  await seedUsers();
  await seedCategories();
  await seedSubcategories();
  await seedBrands();
  await seedVendors();
  await seedCollections();
  await seedProducts();
  await seedProductImagesSimple();
  await seedBlogTags();
  await seedPosts();
  await seedPostTags();
  await seedTestimonialsSimple();
  await seedCartsAndItems();
  await seedOrdersAndItems();
  await seedQuotesAndItems();
  await seedInvoicesAndItems();
  await seedReviews();
  await seedRefreshTokens();
  log('Seed', 'Done.');
}

module.exports = runSeed;
