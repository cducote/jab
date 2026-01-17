CREATE TABLE IF NOT EXISTS "shopify_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_domain" text NOT NULL,
	"storefront_access_token" text NOT NULL,
	"api_version" text DEFAULT '2024-10' NOT NULL,
	"is_connected" boolean DEFAULT false NOT NULL,
	"last_tested_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shopify_settings_store_domain_unique" UNIQUE("store_domain")
);
