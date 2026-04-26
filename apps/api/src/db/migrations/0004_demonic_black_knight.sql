ALTER TABLE "recurring_transactions" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD COLUMN "next_execution_date" timestamp NOT NULL;