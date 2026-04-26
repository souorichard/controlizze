ALTER TABLE "users" RENAME COLUMN "hash_password" TO "password_hash";--> statement-breakpoint
ALTER TABLE "auth_accounts" DROP CONSTRAINT "auth_accounts_providerAccountId_unique";--> statement-breakpoint
ALTER TABLE "auth_accounts" DROP CONSTRAINT "provider_userid";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_slug_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "slug_type";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "name_slug_type_orgid";--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "userid_orgid";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "recurring_transactions" DROP CONSTRAINT "recurring_transactions_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "recurring_transactions" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "token_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "members_org_id_idx" ON "members" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "organizations_owner_id_idx" ON "organizations" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "recurring_transactions_org_id_idx" ON "recurring_transactions" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "recurring_transactions_status_next_execution_date_idx" ON "recurring_transactions" USING btree ("status","next_execution_date");--> statement-breakpoint
CREATE INDEX "tokens_user_id_idx" ON "tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tokens_type_idx" ON "tokens" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transactions_org_id_transaction_date_idx" ON "transactions" USING btree ("org_id","transaction_date");--> statement-breakpoint
CREATE INDEX "transactions_org_id_status_idx" ON "transactions" USING btree ("org_id","status");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_provider_user_id_unique" UNIQUE("provider","user_id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_org_id_name_type_unique" UNIQUE("org_id","name","type");--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_org_id_unique" UNIQUE("user_id","org_id");--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_token_hash_unique" UNIQUE("token_hash");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurring_execution_unique" UNIQUE("recurring_transaction_id","transaction_date");