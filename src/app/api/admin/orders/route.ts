import { NextRequest, NextResponse } from "next/server";
import { getDb, ordersTable, orderItemsTable } from "@/db";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const db = getDb(cfEnv.DB);

    if (!db) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(100);
    const items = await db.select().from(orderItemsTable);

    // Group items by order
    const populated = orders.map((ord) => ({
      ...ord,
      items: items.filter((it) => it.orderId === ord.id),
    }));

    return NextResponse.json({ orders: populated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const db = getDb(cfEnv.DB);

    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" });
    }

    await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
