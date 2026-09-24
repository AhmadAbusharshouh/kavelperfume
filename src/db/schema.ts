import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const settingsTable = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(), // JSON or string value
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const ordersTable = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  governorate: text("governorate").notNull(),
  cityId: integer("city_id"),
  cityName: text("city_name"),
  villageId: integer("village_id"),
  villageName: text("village_name"),
  addressDetails: text("address_details").notNull(),
  notes: text("notes"),
  subtotal: real("subtotal").notNull(),
  shippingFee: real("shipping_fee").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, dispatched, delivered, cancelled
  logestechsTrackingNumber: text("logestechs_tracking_number"),
  logestechsAwbUrl: text("logestechs_awb_url"),
  logestechsPackageId: text("logestechs_package_id"),
  whatsappNotified: integer("whatsapp_notified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const orderItemsTable = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(), // 'single' | 'bundle'
  title: text("title").notNull(),
  size: text("size").notNull(), // '55ml' | '110ml' | 'combo'
  quantity: integer("quantity").notNull().default(1),
  basePrice: real("base_price").notNull(),
  surchargeTotal: real("surcharge_total").notNull().default(0),
  totalPrice: real("total_price").notNull(),
  selections: text("selections"), // JSON array of selected perfumes { id, name, size, surcharge }
  giftNotes: text("gift_notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Order = typeof ordersTable.$inferSelect;
export type NewOrder = typeof ordersTable.$inferInsert;
export type OrderItem = typeof orderItemsTable.$inferSelect;
export type NewOrderItem = typeof orderItemsTable.$inferInsert;
export type Setting = typeof settingsTable.$inferSelect;
