import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import sql from "mssql";

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Categories ORDER BY id DESC");
    return NextResponse.json(result.recordset);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, name_ar } = await req.json();

    if (!name)
      return NextResponse.json(
        { success: false, message: "Name required" },
        { status: 400 }
      );

    const pool = await getConnection();
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("name_ar", sql.NVarChar, name_ar || "")
      .query("INSERT INTO Categories (name, name_ar) VALUES (@name, @name_ar)");

    return NextResponse.json({ success: true, message: "Category added" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, name_ar } = await req.json();
    if (!id || !name)
      return NextResponse.json(
        { success: false, message: "ID and Name required" },
        { status: 400 }
      );

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("name_ar", sql.NVarChar, name_ar || "")
      .query(
        "UPDATE Categories SET name = @name, name_ar = @name_ar WHERE id = @id"
      );

    return NextResponse.json({ success: true, message: "Category updated" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Categories WHERE id = @id");

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
