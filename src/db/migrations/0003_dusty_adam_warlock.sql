CREATE TABLE "user_business" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_name" text NOT NULL,
	"address" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;