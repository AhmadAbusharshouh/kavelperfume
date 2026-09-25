import fs from "fs";
import path from "path";
import { getDb, ordersTable, orderItemsTable, settingsTable } from "@/db";
import { desc, eq } from "drizzle-orm";

export interface StoredOrderItem {
  id: string;
  orderId: string;
  itemType: string;
  title: string;
  size: string;
  quantity: number;
  basePrice: number;
  surchargeTotal: number;
  totalPrice: number;
  selections?: string | null;
  giftNotes?: string | null;
  createdAt: string | Date;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  governorate: string;
  cityId?: number | null;
  cityName?: string | null;
  villageId?: number | null;
  villageName?: string | null;
  addressDetails: string;
  notes?: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: "pending" | "approved" | "dispatched" | "delivered" | "cancelled";
  logestechsTrackingNumber?: string | null;
  logestechsAwbUrl?: string | null;
  logestechsPackageId?: string | null;
  whatsappNotified?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  items?: StoredOrderItem[];
}

export interface StorePricingSetting {
  base55: number;
  base110: number;
  shipping: number;
}

// In-memory global store to survive across hot-reloads and worker instances
interface GlobalStoreState {
  orders: StoredOrder[];
  items: StoredOrderItem[];
  settings: Record<string, unknown>;
}

declare global {
  // eslint-disable-next-line no-var
  var __kavel_global_store: GlobalStoreState | undefined;
}

if (!globalThis.__kavel_global_store) {
  globalThis.__kavel_global_store = {
    orders: [],
    items: [],
    settings: {
      pricing: { base55: 11, base110: 16, shipping: 2 },
    },
  };
}

const localStore = globalThis.__kavel_global_store;

// Helper to get local data file path (in Node environment)
function getDataFilePath(filename: string): string | null {
  try {
    if (typeof process !== "undefined" && process.cwd) {
      const dir = path.join(process.cwd(), ".data");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return path.join(dir, filename);
    }
  } catch {
    // In restricted edge runtime where fs is unavailable
  }
  return null;
}

// Read from local JSON backup
function loadFromLocalDisk(): void {
  try {
    const filePath = getDataFilePath("kavel_orders.json");
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.orders)) {
        localStore.orders = data.orders;
      }
      if (Array.isArray(data.items)) {
        localStore.items = data.items;
      }
    }
  } catch {
    // Non-fatal
  }
}

// Write to local JSON backup
function saveToLocalDisk(): void {
  try {
    const filePath = getDataFilePath("kavel_orders.json");
    if (filePath) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          {
            orders: localStore.orders,
            items: localStore.items,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
        "utf-8"
      );
    }
  } catch {
    // Non-fatal in edge runtime
  }
}

// Initialize on module load
loadFromLocalDisk();

/**
 * Resolve Cloudflare D1 binding safely
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveD1Binding(): any {
  try {
    // 1. Check opennext cloudflare context
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      return ctx.env.DB;
    }
  } catch {
    // Not running inside cloudflare context
  }

  // 2. Check process.env / globalThis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfEnv = (process.env as any) || {};
  if (cfEnv.DB) return cfEnv.DB;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((globalThis as any).DB) return (globalThis as any).DB;

  return null;
}

/**
 * Ensure D1 SQLite schema exists
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureD1Tables(d1: any) {
  try {
    if (!d1 || typeof d1.exec !== "function") return;
    await d1.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key text PRIMARY KEY NOT NULL,
        value text NOT NULL,
        updated_at integer NOT NULL
      );
      CREATE TABLE IF NOT EXISTS orders (
        id text PRIMARY KEY NOT NULL,
        order_number text NOT NULL UNIQUE,
        full_name text NOT NULL,
        phone text NOT NULL,
        governorate text NOT NULL,
        city_id integer,
        city_name text,
        village_id integer,
        village_name text,
        address_details text NOT NULL,
        notes text,
        subtotal real NOT NULL,
        shipping_fee real NOT NULL,
        total_amount real NOT NULL,
        status text DEFAULT 'pending' NOT NULL,
        logestechs_tracking_number text,
        logestechs_awb_url text,
        logestechs_package_id text,
        whatsapp_notified integer DEFAULT 0,
        created_at integer NOT NULL,
        updated_at integer NOT NULL
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id text PRIMARY KEY NOT NULL,
        order_id text NOT NULL,
        item_type text NOT NULL,
        title text NOT NULL,
        size text NOT NULL,
        quantity integer DEFAULT 1 NOT NULL,
        base_price real NOT NULL,
        surcharge_total real DEFAULT 0 NOT NULL,
        total_price real NOT NULL,
        selections text,
        gift_notes text,
        created_at integer NOT NULL
      );
    `);
  } catch (err) {
    console.warn("[KAVEL DB] Table check warning:", err);
  }
}

/**
 * Save new order + items into D1 and local resilient backup store
 */
export async function createAndSaveOrder(
  order: Omit<StoredOrder, "createdAt" | "updatedAt"> & {
    createdAt?: Date;
    updatedAt?: Date;
  },
  items: Omit<StoredOrderItem, "createdAt">[]
): Promise<StoredOrder> {
  const now = new Date();
  const fullOrder: StoredOrder = {
    ...order,
    status: order.status || "pending",
    createdAt: order.createdAt || now,
    updatedAt: order.updatedAt || now,
  };

  const fullItems: StoredOrderItem[] = items.map((it) => ({
    ...it,
    createdAt: now,
  }));

  // 1. Save to in-memory & local disk store
  localStore.orders.unshift(fullOrder);
  localStore.items.push(...fullItems);
  saveToLocalDisk();

  // 2. Save to Cloudflare D1 if available
  let d1Saved = false;
  try {
    const d1 = resolveD1Binding();
    if (d1) {
      await ensureD1Tables(d1);
      const db = getDb(d1);
      if (db) {
        await db.insert(ordersTable).values({
          id: fullOrder.id,
          orderNumber: fullOrder.orderNumber,
          fullName: fullOrder.fullName,
          phone: fullOrder.phone,
          governorate: fullOrder.governorate,
          cityId: fullOrder.cityId || null,
          cityName: fullOrder.cityName || null,
          villageId: fullOrder.villageId || null,
          villageName: fullOrder.villageName || null,
          addressDetails: fullOrder.addressDetails,
          notes: fullOrder.notes || null,
          subtotal: fullOrder.subtotal,
          shippingFee: fullOrder.shippingFee,
          totalAmount: fullOrder.totalAmount,
          status: fullOrder.status,
          whatsappNotified: fullOrder.whatsappNotified || false,
          createdAt: now,
          updatedAt: now,
        });

        for (const item of fullItems) {
          await db.insert(orderItemsTable).values({
            id: item.id,
            orderId: item.orderId,
            itemType: item.itemType || "single",
            title: item.title,
            size: item.size || "110ml",
            quantity: item.quantity || 1,
            basePrice: item.basePrice || 0,
            surchargeTotal: item.surchargeTotal || 0,
            totalPrice: item.totalPrice || 0,
            selections: item.selections || null,
            giftNotes: item.giftNotes || null,
            createdAt: now,
          });
        }
        d1Saved = true;
      }
    }
  } catch (d1Err) {
    console.error("[KAVEL DB] D1 insert failed, order safely kept in resilient backup store:", d1Err);
  }

  // 3. Prominent Server Console Log for instantaneous visibility
  console.log("\n" + "=".repeat(68));
  console.log(`📦 [KAVEL PERFUME] NEW ORDER RECEIVED: #${fullOrder.orderNumber}`);
  console.log(`👤 Customer: ${fullOrder.fullName} | 📱 Phone: ${fullOrder.phone}`);
  console.log(`📍 Location: ${fullOrder.governorate} / ${fullOrder.cityName || ""} (${fullOrder.addressDetails})`);
  console.log(`🛒 Items (${fullItems.length}):`);
  fullItems.forEach((it, idx) => {
    console.log(`   ${idx + 1}. ${it.title} (${it.size}) × ${it.quantity} = ${it.totalPrice} د.أ`);
  });
  console.log(`💵 Total Amount: ${fullOrder.totalAmount} د.أ (Subtotal: ${fullOrder.subtotal} د.أ + Shipping: ${fullOrder.shippingFee} د.أ)`);
  console.log(`💾 Storage: ${d1Saved ? "✅ D1 Database & Local Store" : "✅ Local Backup Store"} | Order ID: ${fullOrder.id}`);
  console.log("=".repeat(68) + "\n");

  return {
    ...fullOrder,
    items: fullItems,
  };
}

/**
 * Fetch all orders with items populated, merging D1 and local store
 */
export async function getAllOrders(): Promise<StoredOrder[]> {
  loadFromLocalDisk();
  const ordersMap = new Map<string, StoredOrder>();

  // Load from local store first
  for (const ord of localStore.orders) {
    const items = localStore.items.filter((it) => it.orderId === ord.id);
    ordersMap.set(ord.id, { ...ord, items });
  }

  // Then try D1 to get any cloud-persisted orders
  try {
    const d1 = resolveD1Binding();
    if (d1) {
      await ensureD1Tables(d1);
      const db = getDb(d1);
      if (db) {
        const d1Orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(100);
        const d1Items = await db.select().from(orderItemsTable);

        for (const ord of d1Orders) {
          const items = d1Items
            .filter((it) => it.orderId === ord.id)
            .map((it) => ({
              id: it.id,
              orderId: it.orderId,
              itemType: it.itemType,
              title: it.title,
              size: it.size,
              quantity: it.quantity,
              basePrice: it.basePrice,
              surchargeTotal: it.surchargeTotal,
              totalPrice: it.totalPrice,
              selections: it.selections,
              giftNotes: it.giftNotes,
              createdAt: it.createdAt,
            }));

          ordersMap.set(ord.id, {
            id: ord.id,
            orderNumber: ord.orderNumber,
            fullName: ord.fullName,
            phone: ord.phone,
            governorate: ord.governorate,
            cityId: ord.cityId,
            cityName: ord.cityName,
            villageId: ord.villageId,
            villageName: ord.villageName,
            addressDetails: ord.addressDetails,
            notes: ord.notes,
            subtotal: ord.subtotal,
            shippingFee: ord.shippingFee,
            totalAmount: ord.totalAmount,
            status: ord.status as StoredOrder["status"],
            logestechsTrackingNumber: ord.logestechsTrackingNumber,
            logestechsAwbUrl: ord.logestechsAwbUrl,
            logestechsPackageId: ord.logestechsPackageId,
            whatsappNotified: ord.whatsappNotified || false,
            createdAt: ord.createdAt,
            updatedAt: ord.updatedAt,
            items,
          });
        }
      }
    }
  } catch (err) {
    console.warn("[KAVEL DB] D1 order query fallback to local store:", err);
  }

  const all = Array.from(ordersMap.values());
  // Sort descending by date
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<StoredOrder | null> {
  const all = await getAllOrders();
  return all.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
}

/**
 * Update order status and dispatch information
 */
export async function updateOrderStatus(
  orderId: string,
  updateData: Partial<StoredOrder>
): Promise<boolean> {
  const now = new Date();

  // Update in local store
  const localIdx = localStore.orders.findIndex((o) => o.id === orderId);
  if (localIdx !== -1) {
    localStore.orders[localIdx] = {
      ...localStore.orders[localIdx],
      ...updateData,
      updatedAt: now,
    };
    saveToLocalDisk();
  }

  // Update in D1
  try {
    const d1 = resolveD1Binding();
    if (d1) {
      const db = getDb(d1);
      if (db) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patch: any = { updatedAt: now };
        if (updateData.status) patch.status = updateData.status;
        if (updateData.logestechsTrackingNumber !== undefined)
          patch.logestechsTrackingNumber = updateData.logestechsTrackingNumber;
        if (updateData.logestechsAwbUrl !== undefined)
          patch.logestechsAwbUrl = updateData.logestechsAwbUrl;
        if (updateData.logestechsPackageId !== undefined)
          patch.logestechsPackageId = updateData.logestechsPackageId;
        if (updateData.whatsappNotified !== undefined)
          patch.whatsappNotified = updateData.whatsappNotified;

        await db.update(ordersTable).set(patch).where(eq(ordersTable.id, orderId));
      }
    }
  } catch (err) {
    console.error("[KAVEL DB] Failed updating order in D1:", err);
  }

  return true;
}

/**
 * Get store pricing settings
 */
export async function getStoreSettings(): Promise<{ pricing: StorePricingSetting }> {
  const fallback = { base55: 11, base110: 16, shipping: 2 };

  try {
    const d1 = resolveD1Binding();
    if (d1) {
      await ensureD1Tables(d1);
      const db = getDb(d1);
      if (db) {
        const rows = await db.select().from(settingsTable);
        const pricingRow = rows.find((r) => r.key === "pricing");
        if (pricingRow) {
          try {
            return { pricing: JSON.parse(pricingRow.value) };
          } catch {
            // parse error
          }
        }
      }
    }
  } catch {
    // fallback
  }

  if (localStore.settings["pricing"]) {
    return { pricing: localStore.settings["pricing"] as StorePricingSetting };
  }

  return { pricing: fallback };
}

/**
 * Save store setting
 */
export async function saveStoreSetting(key: string, value: unknown): Promise<void> {
  localStore.settings[key] = value;

  try {
    const d1 = resolveD1Binding();
    if (d1) {
      await ensureD1Tables(d1);
      const db = getDb(d1);
      if (db) {
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
      }
    }
  } catch (err) {
    console.error("[KAVEL DB] Failed saving setting to D1:", err);
  }
}
