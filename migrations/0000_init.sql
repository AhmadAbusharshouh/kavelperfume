CREATE TABLE IF NOT EXISTS `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL UNIQUE,
	`full_name` text NOT NULL,
	`phone` text NOT NULL,
	`governorate` text NOT NULL,
	`city_id` integer,
	`city_name` text,
	`village_id` integer,
	`village_name` text,
	`address_details` text NOT NULL,
	`notes` text,
	`subtotal` real NOT NULL,
	`shipping_fee` real NOT NULL,
	`total_amount` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`logestechs_tracking_number` text,
	`logestechs_awb_url` text,
	`logestechs_package_id` text,
	`whatsapp_notified` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`item_type` text NOT NULL,
	`title` text NOT NULL,
	`size` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`base_price` real NOT NULL,
	`surcharge_total` real DEFAULT 0 NOT NULL,
	`total_price` real NOT NULL,
	`selections` text,
	`gift_notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
