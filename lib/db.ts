import sql, { config as SQLConfig, ConnectionPool } from "mssql";

export interface Product {
  id: number;
  Title: string;
  Title_ar?: string;
  price: number;
  image: string;

  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  name_ar?: string;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  name_ar?: string;
  tagline: string;
  tagline_ar?: string;
  logoUrl: string;
  phone: string;
  address: string;
  address_ar?: string;
  email: string;
}

export interface ShippingDetails {
  name: string;
  phone: string;
  email: string;
  area: string;
  block: string;
  street: string;
  house: string;
  avenue?: string;
  specialDirections?: string;
}

export interface OrderItemInput {
  id?: number; // <--- ADDED THIS (The Product ID)
  Title: string;
  Title_ar?: string;
  qty: number;
  price: number;
  image: string;
}

export interface CreateOrderInput {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: ShippingDetails;
  totalAmount: number;
  items: OrderItemInput[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
}

export interface OrderDTO {
  id: number;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string; // Added
  totalAmount: number;
  status: string;
  date: Date;
  addressJson: string;
  productName: string;
  productImage: string;
  categoryName: string; // Added
  itemsCount: number;
}

export interface OrderItemDetail {
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

const config: SQLConfig = {
  user: "db_abece2_ecommerce_admin",
  password: "Mobark12.",
  server: "sql6030.site4now.net",
  database: "db_abece2_ecommerce",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

let poolPromise: Promise<ConnectionPool> | null = null;

async function getPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

export const getConnection = getPool;

export async function getProducts(): Promise<Product[]> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT id, Title, Title_ar, price, image, categoryId
    FROM dbo.Products
    ORDER BY id
  `);

  return result.recordset as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT id, name, name_ar
    FROM dbo.Categories
    ORDER BY id
  `);

  return result.recordset as Category[];
}

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT TOP 1 
      id, 
      name, name_ar, 
      tagline, tagline_ar, 
      logoUrl, 
      phone, 
      address, address_ar, 
      email
    FROM dbo.RestaurantInfo
  `);

  return result.recordset[0] || null;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  return getProducts();
}

export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  return getCategories();
}

export async function getRestaurantInfoForAdmin(): Promise<RestaurantInfo | null> {
  return getRestaurantInfo();
}


export async function getAllOrdersWithDetails(
  page: number = 1,
  pageSize: number = 10,
  period: string = "all"
): Promise<{ orders: OrderDTO[]; totalCount: number }> {
  const pool = await getPool();
  const offset = (page - 1) * pageSize;

  // Date Filter Logic
  let dateCondition = "";
  if (period === "today")
    dateCondition = "AND o.created_at >= CAST(GETDATE() AS DATE)";
  if (period === "week")
    dateCondition = "AND o.created_at >= DATEADD(day, -7, GETDATE())";
  if (period === "month")
    dateCondition = "AND o.created_at >= DATEADD(month, -1, GETDATE())";

  // Get Total Count
  const countResult = await pool.request().query(`
    SELECT COUNT(*) as count FROM dbo.Orders o WHERE 1=1 ${dateCondition}
  `);
  const totalCount = countResult.recordset[0].count;

  // Main Query with Professional JOIN for Categories
  const result = await pool.request().query(`
    SELECT 
      o.id,
      o.paymentId,
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      o.totalAmount,
      o.status,
      o.address as addressJson,
      ISNULL(o.created_at, GETDATE()) as date, 
      i.productName,
      i.image as productImage,
      -- Fetch Category Name via ProductId -> Products -> Categories
      ISNULL(c.name, 'General') as categoryName, 
      (SELECT COUNT(*) FROM dbo.OrderItems WHERE orderId = o.id) as itemsCount
    FROM dbo.Orders o
    OUTER APPLY (
        SELECT TOP 1 oi.productName, oi.image, oi.productId
        FROM dbo.OrderItems oi
        WHERE oi.orderId = o.id
    ) i
    LEFT JOIN dbo.Products p ON p.id = i.productId
    LEFT JOIN dbo.Categories c ON c.id = p.categoryId
    WHERE 1=1 ${dateCondition}
    ORDER BY o.created_at DESC
    OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
  `);

  return { orders: result.recordset as OrderDTO[], totalCount };
}

// --- 3. STATUS UPDATE FUNCTION ---
export async function updateOrderStatusInDb(
  orderId: number,
  newStatus: string
): Promise<boolean> {
  const pool = await getPool();
  try {
    await pool
      .request()
      .input("id", sql.Int, orderId)
      .input("status", sql.NVarChar, newStatus).query(`
        UPDATE dbo.Orders 
        SET status = @status, updated_at = GETDATE() 
        WHERE id = @id
      `);
    return true;
  } catch (e) {
    console.error("Error updating status", e);
    return false;
  }
}

// --- 4. GET ITEMS FOR MODAL ---
export async function getOrderItems(
  orderId: number
): Promise<OrderItemDetail[]> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("orderId", sql.Int, orderId)
    .query(
      `SELECT productName, quantity, price, image FROM dbo.OrderItems WHERE orderId = @orderId`
    );
  return result.recordset as OrderItemDetail[];
}

// --- 5. DASHBOARD STATS ---
export async function getDashboardStats() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT 
      SUM(totalAmount) as totalRevenue,
      COUNT(id) as totalOrders,
      SUM(CASE WHEN status = 'DELIVERED' OR status = 'COMPLETED' THEN 1 ELSE 0 END) as completedOrders,
      SUM(CASE WHEN status = 'PAID' OR status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmedOrders,
      SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledOrders
    FROM dbo.Orders
  `);

  const row = result.recordset[0];
  return {
    totalRevenue: row.totalRevenue || 0,
    totalOrders: row.totalOrders || 0,
    completedOrders: row.completedOrders || 0,
    confirmedOrders: row.confirmedOrders || 0,
    cancelledOrders: row.cancelledOrders || 0,
  };
}
