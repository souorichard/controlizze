ALTER TYPE "public"."recurring_status_enum" RENAME TO "recurrences_status_enum";--> statement-breakpoint
ALTER TABLE "recurring_transactions" RENAME TO "recurrences";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "recurring_transaction_id" TO "recurrence_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_recurring_execution_unique";--> statement-breakpoint
ALTER TABLE "recurrences" DROP CONSTRAINT "recurring_transactions_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "recurrences" DROP CONSTRAINT "recurring_transactions_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "recurrences" DROP CONSTRAINT "recurring_transactions_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_recurring_transaction_id_recurring_transactions_id_fk";
--> statement-breakpoint
DROP INDEX "recurring_transactions_org_id_idx";--> statement-breakpoint
DROP INDEX "recurring_transactions_status_next_execution_date_idx";--> statement-breakpoint
ALTER TABLE "recurrences" ADD CONSTRAINT "recurrences_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrences" ADD CONSTRAINT "recurrences_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrences" ADD CONSTRAINT "recurrences_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurrence_id_recurrences_id_fk" FOREIGN KEY ("recurrence_id") REFERENCES "public"."recurrences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recurrences_org_id_idx" ON "recurrences" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "recurrences_status_next_execution_date_idx" ON "recurrences" USING btree ("status","next_execution_date");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurrence_execution_unique" UNIQUE("recurrence_id","transaction_date");