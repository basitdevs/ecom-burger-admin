import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getConnection();
    
    // We join 'signup' with 'Orders' on email to get analytics
    const result = await pool.request().query(`
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.mobile, 
        s.country,
        COUNT(o.id) as ordersCount,
        ISNULL(SUM(o.totalAmount), 0) as totalSpent
      FROM signup s
      LEFT JOIN Orders o ON s.email = o.customerEmail
      GROUP BY s.id, s.name, s.email, s.mobile, s.country
      ORDER BY s.id DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}