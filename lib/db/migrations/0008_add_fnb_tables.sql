-- Shift Management Tables
CREATE TABLE IF NOT EXISTS "Shift" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"startTime" varchar(10) NOT NULL,
	"endTime" varchar(10) NOT NULL,
	"date" timestamp NOT NULL,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ShiftAssignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shiftId" uuid NOT NULL,
	"employeeId" uuid NOT NULL,
	"role" varchar(100),
	"checkInTime" timestamp,
	"checkOutTime" timestamp,
	"breakMinutes" integer DEFAULT 0,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ShiftSwapRequest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requestingEmployeeId" uuid NOT NULL,
	"targetEmployeeId" uuid,
	"shiftAssignmentId" uuid NOT NULL,
	"reason" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"approvedBy" uuid,
	"approvedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

-- Inventory Management Tables
CREATE TABLE IF NOT EXISTS "Supplier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"contactPerson" varchar(100),
	"email" varchar(255),
	"phone" varchar(20),
	"address" text,
	"paymentTerms" varchar(100),
	"status" varchar DEFAULT 'active' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "InventoryCategory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"parentCategoryId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "InventoryItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"sku" varchar(100) UNIQUE,
	"categoryId" uuid,
	"unit" varchar(50) NOT NULL,
	"unitCost" numeric(10, 2),
	"supplierId" uuid,
	"minimumStock" numeric(10, 2) DEFAULT '0' NOT NULL,
	"maximumStock" numeric(10, 2),
	"currentStock" numeric(10, 2) DEFAULT '0' NOT NULL,
	"location" varchar(100),
	"isPerishable" boolean DEFAULT false NOT NULL,
	"expiryDate" timestamp,
	"status" varchar DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "InventoryTransaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventoryItemId" uuid NOT NULL,
	"type" varchar NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unitCost" numeric(10, 2),
	"totalCost" numeric(10, 2),
	"previousStock" numeric(10, 2) NOT NULL,
	"newStock" numeric(10, 2) NOT NULL,
	"referenceType" varchar(50),
	"referenceId" uuid,
	"performedBy" uuid NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "InventoryCount" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"countDate" timestamp NOT NULL,
	"countType" varchar NOT NULL,
	"status" varchar DEFAULT 'in-progress' NOT NULL,
	"performedBy" uuid NOT NULL,
	"approvedBy" uuid,
	"approvedAt" timestamp,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "InventoryCountItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventoryCountId" uuid NOT NULL,
	"inventoryItemId" uuid NOT NULL,
	"expectedQuantity" numeric(10, 2) NOT NULL,
	"actualQuantity" numeric(10, 2) NOT NULL,
	"variance" numeric(10, 2) NOT NULL,
	"varianceValue" numeric(10, 2),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

-- Add Foreign Key Constraints
DO $$ BEGIN
 ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_shiftId_Shift_id_fk" FOREIGN KEY ("shiftId") REFERENCES "public"."Shift"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_employeeId_Employee_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_requestingEmployeeId_Employee_id_fk" FOREIGN KEY ("requestingEmployeeId") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_targetEmployeeId_Employee_id_fk" FOREIGN KEY ("targetEmployeeId") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_shiftAssignmentId_ShiftAssignment_id_fk" FOREIGN KEY ("shiftAssignmentId") REFERENCES "public"."ShiftAssignment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_approvedBy_Employee_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryCategory" ADD CONSTRAINT "InventoryCategory_parentCategoryId_InventoryCategory_id_fk" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."InventoryCategory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_categoryId_InventoryCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."InventoryCategory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_supplierId_Supplier_id_fk" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryItemId_InventoryItem_id_fk" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_performedBy_Employee_id_fk" FOREIGN KEY ("performedBy") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_performedBy_Employee_id_fk" FOREIGN KEY ("performedBy") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_approvedBy_Employee_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."Employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryCountItem" ADD CONSTRAINT "InventoryCountItem_inventoryCountId_InventoryCount_id_fk" FOREIGN KEY ("inventoryCountId") REFERENCES "public"."InventoryCount"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "InventoryCountItem" ADD CONSTRAINT "InventoryCountItem_inventoryItemId_InventoryItem_id_fk" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;