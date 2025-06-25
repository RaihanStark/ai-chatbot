CREATE TABLE IF NOT EXISTS "Employee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"position" varchar NOT NULL,
	"department" varchar NOT NULL,
	"hireDate" timestamp NOT NULL,
	"salary" varchar(20) NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"address" text,
	"emergencyContact" varchar(255),
	"emergencyPhone" varchar(20),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Employee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN IF EXISTS "visibility";