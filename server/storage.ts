import { users, products, orders, payouts, platform_settings, support_requests, vendor_support_requests, payments, transactions, type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type Payout, type InsertPayout, type PlatformSettings, type SupportRequest, type InsertSupportRequest, type VendorSupportRequest, type InsertVendorSupportRequest, type Payment, type InsertPayment } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not found. Please configure PostgreSQL database.");
}

const pool = new pg.Pool({
  connectionString,
});

const db = drizzle(pool);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  getVendors(): Promise<User[]>;
  getPendingVendors(): Promise<User[]>;
  approveVendor(id: string): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByVendor(vendorId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Enhanced filtering methods
  getFlashSaleProducts(): Promise<Product[]>;
  getClearanceProducts(): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  getNewThisWeekProducts(): Promise<Product[]>;
  getTopSellingProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getHotDealsProducts(): Promise<Product[]>;
  getDontMissProducts(): Promise<Product[]>;
  getProductsByFilter(filters: {
    category?: string;
    isFlashSale?: boolean;
    isClearance?: boolean;
    isTrending?: boolean;
    isNewThisWeek?: boolean;
    isTopSelling?: boolean;
    isFeatured?: boolean;
    isHotDeal?: boolean;
    isDontMiss?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Promise<Product[]>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersByVendor(vendorId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  
  // Payouts
  getPayouts(): Promise<Payout[]>;
  getPayoutsByVendor(vendorId: string): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: string, payout: Partial<InsertPayout>): Promise<Payout>;
  
  // Platform Settings
  getPlatformSettings(): Promise<PlatformSettings>;
  updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings>;
  
  // Analytics
  getVendorStats(vendorId: string): Promise<{
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    pendingPayouts: number;
  }>;
  
  getPlatformStats(): Promise<{
    totalVendors: number;
    totalOrders: number;
    platformRevenue: number;
    pendingPayouts: number;
  }>;

  // Support Requests
  createSupportRequest(request: InsertSupportRequest): Promise<SupportRequest>;
  createVendorSupportRequest(request: InsertVendorSupportRequest): Promise<VendorSupportRequest>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByReference(reference: string): Promise<Payment | undefined>;
  getPaymentByPaystackReference(paystackReference: string): Promise<Payment | undefined>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;
  getPaymentsByOrder(orderId: string): Promise<Payment[]>;
  getPaymentsByVendor(vendorId: string): Promise<Payment[]>;
  
  // Users lookup
  getUsers(): Promise<User[]>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getVendors(): Promise<User[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(users).where(eq(users.role, "vendor"));
  }

  async getPendingVendors(): Promise<User[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(users).where(and(eq(users.role, "vendor"), eq(users.is_approved, false)));
  }

  async approveVendor(id: string): Promise<User> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(users).set({ is_approved: true }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.created_at));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.status, "active")));
  }

  async getProductsByVendor(vendorId: string): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products).where(eq(products.vendor_id, vendorId));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(products).values({
      ...product,
      // Ensure product_images is properly handled
      product_images: product.product_images || []
    }).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.delete(products).where(eq(products.id, id));
  }

  // Enhanced filtering methods
  async getFlashSaleProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_flash_sale, true), eq(products.status, "active")))
      .orderBy(desc(products.created_at));
  }

  async getClearanceProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_clearance, true), eq(products.status, "active")))
      .orderBy(desc(products.discount_percentage));
  }

  async getTrendingProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_trending, true), eq(products.status, "active")))
      .orderBy(desc(products.rating_average));
  }

  async getNewThisWeekProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_new_this_week, true), eq(products.status, "active")))
      .orderBy(desc(products.created_at));
  }

  async getTopSellingProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_top_selling, true), eq(products.status, "active")))
      .orderBy(desc(products.rating_count));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_featured, true), eq(products.status, "active")))
      .orderBy(desc(products.created_at));
  }

  async getHotDealsProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_hot_deal, true), eq(products.status, "active")))
      .orderBy(desc(products.discount_percentage));
  }

  async getDontMissProducts(): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(products)
      .where(and(eq(products.is_dont_miss, true), eq(products.status, "active")))
      .orderBy(desc(products.rating_average));
  }

  async getProductsByFilter(filters: {
    category?: string;
    isFlashSale?: boolean;
    isClearance?: boolean;
    isTrending?: boolean;
    isNewThisWeek?: boolean;
    isTopSelling?: boolean;
    isFeatured?: boolean;
    isHotDeal?: boolean;
    isDontMiss?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Promise<Product[]> {
    if (!db) throw new Error('Database not available');
    
    const conditions: any[] = [eq(products.status, "active")];
    
    if (filters.category) {
      conditions.push(eq(products.category, filters.category));
    }
    
    if (filters.isFlashSale) {
      conditions.push(eq(products.is_flash_sale, true));
    }
    
    if (filters.isClearance) {
      conditions.push(eq(products.is_clearance, true));
    }
    
    if (filters.isTrending) {
      conditions.push(eq(products.is_trending, true));
    }
    
    if (filters.isNewThisWeek) {
      conditions.push(eq(products.is_new_this_week, true));
    }
    
    if (filters.isTopSelling) {
      conditions.push(eq(products.is_top_selling, true));
    }
    
    if (filters.isFeatured) {
      conditions.push(eq(products.is_featured, true));
    }
    
    if (filters.isHotDeal) {
      conditions.push(eq(products.is_hot_deal, true));
    }
    
    if (filters.isDontMiss) {
      conditions.push(eq(products.is_dont_miss, true));
    }
    
    if (filters.minPrice !== undefined) {
      conditions.push(sql`${products.price} >= ${filters.minPrice}`);
    }
    
    if (filters.maxPrice !== undefined) {
      conditions.push(sql`${products.price} <= ${filters.maxPrice}`);
    }
    
    if (filters.searchTerm) {
      conditions.push(sql`(
        LOWER(${products.title}) LIKE LOWER('%${filters.searchTerm}%') OR 
        LOWER(${products.description}) LIKE LOWER('%${filters.searchTerm}%') OR
        LOWER(${products.brand}) LIKE LOWER('%${filters.searchTerm}%') OR
        ${filters.searchTerm} = ANY(${products.search_keywords})
      )`);
    }
    
    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.created_at));
  }

  async getOrders(): Promise<Order[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(orders).orderBy(desc(orders.created_at));
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(orders).where(eq(orders.buyer_id, buyerId));
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(orders).where(eq(orders.vendor_id, vendorId));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async getPayouts(): Promise<Payout[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(payouts).orderBy(desc(payouts.created_at));
  }

  async getPayoutsByVendor(vendorId: string): Promise<Payout[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(payouts).where(eq(payouts.vendor_id, vendorId));
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(payouts).values(payout).returning();
    return result[0];
  }

  async updatePayout(id: string, payout: Partial<InsertPayout>): Promise<Payout> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(payouts).set({
      ...payout,
      updated_at: new Date()
    }).where(eq(payouts.id, id)).returning();
    return result[0];
  }

  async getPlatformSettings(): Promise<PlatformSettings> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(platform_settings).limit(1);
    if (result.length === 0) {
      const defaultSettings = await db.insert(platform_settings).values({}).returning();
      return defaultSettings[0];
    }
    return result[0];
  }

  async updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    if (!db) throw new Error('Database not available');
    const current = await this.getPlatformSettings();
    const result = await db.update(platform_settings).set(settings).where(eq(platform_settings.id, current.id)).returning();
    return result[0];
  }

  async getVendorStats(vendorId: string): Promise<{
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    pendingPayouts: number;
  }> {
    if (!db) throw new Error('Database not available');
    const [salesResult, ordersResult, productsResult, payoutsResult] = await Promise.all([
      db.select({ total: sql<number>`sum(${orders.total_amount})` }).from(orders).where(eq(orders.vendor_id, vendorId)),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.vendor_id, vendorId)),
      db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.vendor_id, vendorId)),
      db.select({ total: sql<number>`sum(${payouts.amount})` }).from(payouts).where(and(eq(payouts.vendor_id, vendorId), eq(payouts.status, "pending")))
    ]);

    return {
      totalSales: salesResult[0]?.total || 0,
      totalOrders: ordersResult[0]?.count || 0,
      totalProducts: productsResult[0]?.count || 0,
      pendingPayouts: payoutsResult[0]?.total || 0,
    };
  }

  async getPlatformStats(): Promise<{
    totalVendors: number;
    totalOrders: number;
    platformRevenue: number;
    pendingPayouts: number;
  }> {
    if (!db) throw new Error('Database not available');
    const [vendorsResult, ordersResult, revenueResult, payoutsResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "vendor")),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<number>`sum(${orders.total_amount})` }).from(orders),
      db.select({ total: sql<number>`sum(${payouts.amount})` }).from(payouts).where(eq(payouts.status, "pending"))
    ]);

    const settings = await this.getPlatformSettings();
    const commission = parseFloat(settings.commission_percentage || "5");
    const platformRevenue = (revenueResult[0]?.total || 0) * (commission / 100);

    return {
      totalVendors: vendorsResult[0]?.count || 0,
      totalOrders: ordersResult[0]?.count || 0,
      platformRevenue,
      pendingPayouts: payoutsResult[0]?.total || 0,
    };
  }

  async createSupportRequest(request: InsertSupportRequest): Promise<SupportRequest> {
    const [newRequest] = await db.insert(support_requests).values(request).returning();
    return newRequest;
  }

  async createVendorSupportRequest(request: InsertVendorSupportRequest): Promise<VendorSupportRequest> {
    const [newRequest] = await db.insert(vendor_support_requests).values(request).returning();
    return newRequest;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentByReference(reference: string): Promise<Payment | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(payments).where(eq(payments.reference, reference)).limit(1);
    return result[0];
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment> {
    if (!db) throw new Error('Database not available');
    const result = await db.update(payments).set(payment).where(eq(payments.id, id)).returning();
    return result[0];
  }

  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(payments).where(eq(payments.order_id, orderId));
  }

  async getPaymentsByVendor(vendorId: string): Promise<Payment[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(payments).where(eq(payments.vendor_id, vendorId));
  }

  async getPaymentByPaystackReference(paystackReference: string): Promise<Payment | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(payments).where(eq(payments.paystack_reference, paystackReference)).limit(1);
    return result[0];
  }

  async getUsers(): Promise<User[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(users);
  }
}

console.log('Storage initialization: Using PostgreSQL with DATABASE_URL');

export const storage = new PostgresStorage();
