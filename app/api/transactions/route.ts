import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT 
        id,
        paymentId,
        created_at as date,
        'Ecom-Burger' as seller,
        'Credit Card' as method,
        'Payment' as type,
         status,
        'Kuwait' as country,
        'KWD' as curr,
        totalAmount as total
      FROM Orders
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}