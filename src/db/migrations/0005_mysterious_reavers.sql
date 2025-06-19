ALTER TABLE "user_business" RENAME COLUMN "country" TO "region_code";--> statement-breakpoint
ALTER TABLE "user_business" ADD COLUMN "phone" text NOT NULL;