import { NextResponse } from "next/server";
import { getTransactionDetails } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params are async in Next.js 15+
) {
  try {
    const { id } = await params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const data = await getTransactionDetails(transactionId);

    if (!data) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}