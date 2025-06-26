import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
  decimal,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;


export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatId: uuid('chatId').notNull(),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;

export const employee = pgTable('Employee', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  position: varchar('position', { 
    enum: ['manager', 'chef', 'sous-chef', 'line-cook', 'server', 'bartender', 'host', 'busser', 'dishwasher'] 
  }).notNull(),
  department: varchar('department', { 
    enum: ['kitchen', 'front-of-house', 'bar', 'management'] 
  }).notNull(),
  hireDate: timestamp('hireDate').notNull(),
  salary: varchar('salary', { length: 20 }).notNull(),
  status: varchar('status', { enum: ['active', 'inactive', 'on-leave'] }).notNull().default('active'),
  address: text('address'),
  emergencyContact: varchar('emergencyContact', { length: 255 }),
  emergencyPhone: varchar('emergencyPhone', { length: 20 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Employee = InferSelectModel<typeof employee>;

// SHIFT MANAGEMENT SCHEMAS

export const shift = pgTable('Shift', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "Morning Shift", "Evening Shift"
  startTime: varchar('startTime', { length: 10 }).notNull(), // e.g., "09:00"
  endTime: varchar('endTime', { length: 10 }).notNull(), // e.g., "17:00"
  date: timestamp('date').notNull(),
  status: varchar('status', { enum: ['scheduled', 'in-progress', 'completed', 'cancelled'] }).notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Shift = InferSelectModel<typeof shift>;

export const shiftAssignment = pgTable('ShiftAssignment', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  shiftId: uuid('shiftId')
    .notNull()
    .references(() => shift.id),
  employeeId: uuid('employeeId')
    .notNull()
    .references(() => employee.id),
  role: varchar('role', { length: 100 }), // Role for this shift (might differ from regular position)
  checkInTime: timestamp('checkInTime'),
  checkOutTime: timestamp('checkOutTime'),
  breakMinutes: integer('breakMinutes').default(0),
  status: varchar('status', { enum: ['scheduled', 'confirmed', 'checked-in', 'checked-out', 'no-show', 'cancelled'] }).notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type ShiftAssignment = InferSelectModel<typeof shiftAssignment>;

export const shiftSwapRequest = pgTable('ShiftSwapRequest', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  requestingEmployeeId: uuid('requestingEmployeeId')
    .notNull()
    .references(() => employee.id),
  targetEmployeeId: uuid('targetEmployeeId')
    .references(() => employee.id),
  shiftAssignmentId: uuid('shiftAssignmentId')
    .notNull()
    .references(() => shiftAssignment.id),
  reason: text('reason'),
  status: varchar('status', { enum: ['pending', 'approved', 'rejected', 'cancelled'] }).notNull().default('pending'),
  approvedBy: uuid('approvedBy')
    .references(() => employee.id),
  approvedAt: timestamp('approvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type ShiftSwapRequest = InferSelectModel<typeof shiftSwapRequest>;

// INVENTORY MANAGEMENT SCHEMAS

export const supplier = pgTable('Supplier', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  contactPerson: varchar('contactPerson', { length: 100 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  paymentTerms: varchar('paymentTerms', { length: 100 }), // e.g., "Net 30", "COD"
  status: varchar('status', { enum: ['active', 'inactive', 'suspended'] }).notNull().default('active'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Supplier = InferSelectModel<typeof supplier>;

export const inventoryCategory = pgTable('InventoryCategory', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  parentCategoryId: uuid('parentCategoryId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  parentReference: foreignKey({
    columns: [table.parentCategoryId],
    foreignColumns: [table.id],
  }),
}));

export type InventoryCategory = InferSelectModel<typeof inventoryCategory>;

export const inventoryItem = pgTable('InventoryItem', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 100 }).unique(),
  categoryId: uuid('categoryId')
    .references(() => inventoryCategory.id),
  unit: varchar('unit', { length: 50 }).notNull(), // e.g., "kg", "lbs", "bottles", "cases"
  unitCost: decimal('unitCost', { precision: 10, scale: 2 }),
  supplierId: uuid('supplierId')
    .references(() => supplier.id),
  minimumStock: decimal('minimumStock', { precision: 10, scale: 2 }).notNull().default('0'),
  maximumStock: decimal('maximumStock', { precision: 10, scale: 2 }),
  currentStock: decimal('currentStock', { precision: 10, scale: 2 }).notNull().default('0'),
  location: varchar('location', { length: 100 }), // Storage location
  isPerishable: boolean('isPerishable').notNull().default(false),
  expiryDate: timestamp('expiryDate'),
  status: varchar('status', { enum: ['active', 'discontinued', 'out-of-stock'] }).notNull().default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type InventoryItem = InferSelectModel<typeof inventoryItem>;

export const inventoryTransaction = pgTable('InventoryTransaction', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  inventoryItemId: uuid('inventoryItemId')
    .notNull()
    .references(() => inventoryItem.id),
  type: varchar('type', { enum: ['purchase', 'usage', 'waste', 'adjustment', 'transfer'] }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unitCost: decimal('unitCost', { precision: 10, scale: 2 }),
  totalCost: decimal('totalCost', { precision: 10, scale: 2 }),
  previousStock: decimal('previousStock', { precision: 10, scale: 2 }).notNull(),
  newStock: decimal('newStock', { precision: 10, scale: 2 }).notNull(),
  referenceType: varchar('referenceType', { length: 50 }), // e.g., "purchase_order", "waste_log"
  referenceId: uuid('referenceId'), // ID of related record
  performedBy: uuid('performedBy')
    .notNull()
    .references(() => employee.id),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type InventoryTransaction = InferSelectModel<typeof inventoryTransaction>;

export const inventoryCount = pgTable('InventoryCount', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  countDate: timestamp('countDate').notNull(),
  countType: varchar('countType', { enum: ['daily', 'weekly', 'monthly', 'spot-check'] }).notNull(),
  status: varchar('status', { enum: ['in-progress', 'completed', 'cancelled'] }).notNull().default('in-progress'),
  performedBy: uuid('performedBy')
    .notNull()
    .references(() => employee.id),
  approvedBy: uuid('approvedBy')
    .references(() => employee.id),
  approvedAt: timestamp('approvedAt'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  completedAt: timestamp('completedAt'),
});

export type InventoryCount = InferSelectModel<typeof inventoryCount>;

export const inventoryCountItem = pgTable('InventoryCountItem', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  inventoryCountId: uuid('inventoryCountId')
    .notNull()
    .references(() => inventoryCount.id),
  inventoryItemId: uuid('inventoryItemId')
    .notNull()
    .references(() => inventoryItem.id),
  expectedQuantity: decimal('expectedQuantity', { precision: 10, scale: 2 }).notNull(),
  actualQuantity: decimal('actualQuantity', { precision: 10, scale: 2 }).notNull(),
  variance: decimal('variance', { precision: 10, scale: 2 }).notNull(), // actualQuantity - expectedQuantity
  varianceValue: decimal('varianceValue', { precision: 10, scale: 2 }), // variance * unitCost
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type InventoryCountItem = InferSelectModel<typeof inventoryCountItem>;
