CREATE TYPE "public"."account_enum" AS ENUM('GOOGLE', 'GITHUB');--> statement-breakpoint
CREATE TYPE "public"."billing_cycle" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."frequency_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."invite_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."plan_enum" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TYPE "public"."recurring_status_enum" AS ENUM('ACTIVE', 'PAUSED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('OWNER', 'ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."token_type_enum" AS ENUM('PASSWORD_RECOVER');--> statement-breakpoint
CREATE TYPE "public"."type_enum" AS ENUM('EXPENSE', 'INCOME');--> statement-breakpoint
CREATE TABLE "auth_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"provider" "account_enum" NOT NULL,
	"provider_account_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "auth_accounts_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id"),
	CONSTRAINT "auth_accounts_provider_user_id_unique" UNIQUE("provider","user_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"type" "type_enum" DEFAULT 'EXPENSE' NOT NULL,
	"owner_id" uuid,
	"org_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_org_id_name_type_unique" UNIQUE("org_id","name","type")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"email" text NOT NULL,
	"role" "role_enum" DEFAULT 'MEMBER' NOT NULL,
	"status" "invite_status_enum" DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"author_id" uuid,
	"org_id" uuid NOT NULL,
	CONSTRAINT "invites_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "invites_email_unique" UNIQUE("email"),
	CONSTRAINT "invites_email_org_id_unique" UNIQUE("email","org_id")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "role_enum" DEFAULT 'MEMBER' NOT NULL,
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	CONSTRAINT "members_user_id_org_id_unique" UNIQUE("user_id","org_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"avatar_url" text,
	"avatar_key" text,
	"plan" "plan_enum" DEFAULT 'FREE' NOT NULL,
	"billing_cycle" "billing_cycle" DEFAULT 'MONTHLY',
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recurring_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "type_enum" DEFAULT 'EXPENSE' NOT NULL,
	"category_id" uuid,
	"amount" integer NOT NULL,
	"status" "recurring_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"frequency" "frequency_enum" DEFAULT 'MONTHLY' NOT NULL,
	"interval" integer DEFAULT 1 NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"next_execution_date" timestamp NOT NULL,
	"last_generated_at" timestamp,
	"owner_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"type" "token_type_enum" NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "type_enum" DEFAULT 'EXPENSE' NOT NULL,
	"category_id" uuid,
	"amount" integer NOT NULL,
	"status" "status_enum" DEFAULT 'PENDING' NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"recurring_transaction_id" uuid,
	"owner_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_recurring_execution_unique" UNIQUE("recurring_transaction_id","transaction_date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password_hash" text,
	"email_verified_at" timestamp,
	"last_login_at" timestamp,
	"avatar_url" text,
	"avatar_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurring_transaction_id_recurring_transactions_id_fk" FOREIGN KEY ("recurring_transaction_id") REFERENCES "public"."recurring_transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "members_org_id_idx" ON "members" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "organizations_owner_id_idx" ON "organizations" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "recurring_transactions_org_id_idx" ON "recurring_transactions" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "recurring_transactions_status_next_execution_date_idx" ON "recurring_transactions" USING btree ("status","next_execution_date");--> statement-breakpoint
CREATE INDEX "tokens_user_id_idx" ON "tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tokens_type_idx" ON "tokens" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transactions_org_id_transaction_date_idx" ON "transactions" USING btree ("org_id","transaction_date");--> statement-breakpoint
CREATE INDEX "transactions_org_id_status_idx" ON "transactions" USING btree ("org_id","status");