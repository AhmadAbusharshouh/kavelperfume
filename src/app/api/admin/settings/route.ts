import { NextRequest, NextResponse } from "next/server";
import { getDb, settingsTable } from "@/db";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const db = getDb(cfEnv.DB);

    if (!db) {
      return NextResponse.json({
        pricing: { base55: 11, base110: 16, shipping: 2 },
      });
    }

    const settings = await db.select().from(settingsTable);
    const settingsMap: Record<string, unknown> = {};
    for (const s of settings) {
      try {
        settingsMap[s.key] = JSON.parse(s.value);
      } catch {
        settingsMap[s.key] = s.value;
      }
    }

    return NextResponse.json({
      pricing: settingsMap["pricing"] || { base55: 11, base110: 16, shipping: 2 },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const db = getDb(cfEnv.DB);

    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const valueStr = typeof value === "string" ? value : JSON.stringify(value);

    await db
      .insert(settingsTable)
      .values({
        key,
        value: valueStr,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: {
          value: valueStr,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
