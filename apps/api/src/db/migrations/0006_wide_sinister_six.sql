ALTER TABLE "categories" DROP CONSTRAINT "categories_org_id_name_type_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_org_id_name_unique" UNIQUE("org_id","name");