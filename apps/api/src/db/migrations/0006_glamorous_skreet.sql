CREATE TYPE "public"."billing_cycle" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."plan_enum" AS ENUM('FREE', 'PRO');--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "plan" "plan_enum" DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "billing_cycle" "billing_cycle" DEFAULT 'MONTHLY';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;