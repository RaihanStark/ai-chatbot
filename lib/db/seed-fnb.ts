import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  employee, 
  supplier, 
  inventoryCategory, 
  inventoryItem, 
  inventoryTransaction,
  inventoryCount,
  inventoryCountItem,
  shift,
  shiftAssignment,
  shiftSwapRequest
} from './schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure the POSTGRES_URL environment variable is set
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

// Helper function to generate dates
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Fake employee data for restaurant
const employees = [
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@restaurant.com',
    phone: '+1-555-0101',
    position: 'manager' as const,
    department: 'management' as const,
    hireDate: new Date('2020-01-15'),
    salary: '$75,000',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '+1-555-0201',
  },
  {
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma.williams@restaurant.com',
    phone: '+1-555-0102',
    position: 'chef' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2019-03-20'),
    salary: '$65,000',
    address: '456 Oak Ave, New York, NY 10002',
    emergencyContact: 'John Williams',
    emergencyPhone: '+1-555-0202',
  },
  {
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@restaurant.com',
    phone: '+1-555-0103',
    position: 'sous-chef' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2021-06-10'),
    salary: '$50,000',
    address: '789 Pine St, New York, NY 10003',
    emergencyContact: 'Maria Rodriguez',
    emergencyPhone: '+1-555-0203',
  },
  {
    firstName: 'Sophie',
    lastName: 'Chen',
    email: 'sophie.chen@restaurant.com',
    phone: '+1-555-0104',
    position: 'bartender' as const,
    department: 'bar' as const,
    hireDate: new Date('2022-02-01'),
    salary: '$35,000',
    address: '321 Elm St, New York, NY 10004',
    emergencyContact: 'David Chen',
    emergencyPhone: '+1-555-0204',
  },
  {
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james.anderson@restaurant.com',
    phone: '+1-555-0105',
    position: 'server' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2023-01-15'),
    salary: '$30,000',
    address: '654 Maple Ave, New York, NY 10005',
    emergencyContact: 'Linda Anderson',
    emergencyPhone: '+1-555-0205',
  },
  {
    firstName: 'Olivia',
    lastName: 'Taylor',
    email: 'olivia.taylor@restaurant.com',
    phone: '+1-555-0106',
    position: 'server' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2022-11-20'),
    salary: '$30,000',
    address: '987 Cedar Rd, New York, NY 10006',
    emergencyContact: 'Robert Taylor',
    emergencyPhone: '+1-555-0206',
  },
  {
    firstName: 'Daniel',
    lastName: 'Martinez',
    email: 'daniel.martinez@restaurant.com',
    phone: '+1-555-0107',
    position: 'line-cook' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2023-03-05'),
    salary: '$38,000',
    address: '147 Birch St, New York, NY 10007',
    emergencyContact: 'Carmen Martinez',
    emergencyPhone: '+1-555-0207',
  },
  {
    firstName: 'Ava',
    lastName: 'Brown',
    email: 'ava.brown@restaurant.com',
    phone: '+1-555-0108',
    position: 'host' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2023-05-10'),
    salary: '$28,000',
    address: '258 Spruce Ave, New York, NY 10008',
    emergencyContact: 'William Brown',
    emergencyPhone: '+1-555-0208',
  },
  {
    firstName: 'Lucas',
    lastName: 'Garcia',
    email: 'lucas.garcia@restaurant.com',
    phone: '+1-555-0109',
    position: 'busser' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2023-07-01'),
    salary: '$25,000',
    address: '369 Walnut St, New York, NY 10009',
    emergencyContact: 'Isabel Garcia',
    emergencyPhone: '+1-555-0209',
  },
  {
    firstName: 'Mia',
    lastName: 'Davis',
    email: 'mia.davis@restaurant.com',
    phone: '+1-555-0110',
    position: 'server' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2021-09-15'),
    salary: '$32,000',
    address: '741 Cherry Ln, New York, NY 10010',
    emergencyContact: 'Jennifer Davis',
    emergencyPhone: '+1-555-0210',
  },
  {
    firstName: 'Ethan',
    lastName: 'Wilson',
    email: 'ethan.wilson@restaurant.com',
    phone: '+1-555-0111',
    position: 'dishwasher' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2023-08-20'),
    salary: '$24,000',
    address: '852 Ash Ave, New York, NY 10011',
    emergencyContact: 'Michael Wilson',
    emergencyPhone: '+1-555-0211',
  },
  {
    firstName: 'Isabella',
    lastName: 'Lee',
    email: 'isabella.lee@restaurant.com',
    phone: '+1-555-0112',
    position: 'line-cook' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2022-04-12'),
    salary: '$40,000',
    address: '963 Hickory St, New York, NY 10012',
    emergencyContact: 'Steven Lee',
    emergencyPhone: '+1-555-0212',
    status: 'active' as const,
  },
  {
    firstName: 'Noah',
    lastName: 'Thompson',
    email: 'noah.thompson@restaurant.com',
    phone: '+1-555-0113',
    position: 'bartender' as const,
    department: 'bar' as const,
    hireDate: new Date('2021-12-01'),
    salary: '$36,000',
    address: '159 Poplar Rd, New York, NY 10013',
    emergencyContact: 'Patricia Thompson',
    emergencyPhone: '+1-555-0213',
    status: 'on-leave' as const,
  },
  {
    firstName: 'Charlotte',
    lastName: 'White',
    email: 'charlotte.white@restaurant.com',
    phone: '+1-555-0114',
    position: 'server' as const,
    department: 'front-of-house' as const,
    hireDate: new Date('2020-08-25'),
    salary: '$34,000',
    address: '753 Willow Way, New York, NY 10014',
    emergencyContact: 'Richard White',
    emergencyPhone: '+1-555-0214',
    status: 'inactive' as const,
  },
  {
    firstName: 'Alexander',
    lastName: 'Harris',
    email: 'alexander.harris@restaurant.com',
    phone: '+1-555-0115',
    position: 'sous-chef' as const,
    department: 'kitchen' as const,
    hireDate: new Date('2020-05-18'),
    salary: '$52,000',
    address: '951 Sycamore St, New York, NY 10015',
    emergencyContact: 'Nancy Harris',
    emergencyPhone: '+1-555-0215',
  },
];

// Suppliers data
const suppliers = [
  {
    name: 'Fresh Produce Co.',
    contactPerson: 'John Smith',
    email: 'orders@freshproduce.com',
    phone: '+1-555-1001',
    address: '100 Market St, Brooklyn, NY 11201',
    paymentTerms: 'Net 30',
    status: 'active' as const,
    notes: 'Primary produce supplier, delivers Mon/Wed/Fri'
  },
  {
    name: 'Premium Meats Inc.',
    contactPerson: 'Sarah Johnson',
    email: 'sales@premiummeats.com',
    phone: '+1-555-1002',
    address: '200 Butcher Ave, Queens, NY 11101',
    paymentTerms: 'Net 15',
    status: 'active' as const,
    notes: 'High-quality meat supplier, USDA certified'
  },
  {
    name: 'Ocean Fresh Seafood',
    contactPerson: 'Mike Chen',
    email: 'orders@oceanfresh.com',
    phone: '+1-555-1003',
    address: '300 Harbor Rd, Bronx, NY 10451',
    paymentTerms: 'COD',
    status: 'active' as const,
    notes: 'Daily fresh seafood, early morning deliveries'
  },
  {
    name: 'Bakery Supplies Wholesale',
    contactPerson: 'Emily Brown',
    email: 'info@bakerysupplies.com',
    phone: '+1-555-1004',
    address: '400 Flour St, Manhattan, NY 10001',
    paymentTerms: 'Net 45',
    status: 'active' as const,
    notes: 'Flour, yeast, and baking ingredients'
  },
  {
    name: 'Restaurant Equipment Pro',
    contactPerson: 'David Wilson',
    email: 'support@resequip.com',
    phone: '+1-555-1005',
    address: '500 Industrial Blvd, Staten Island, NY 10301',
    paymentTerms: 'Net 60',
    status: 'active' as const,
    notes: 'Equipment and smallwares supplier'
  }
];

// Inventory categories
const categories = [
  { name: 'Produce', description: 'Fresh fruits and vegetables' },
  { name: 'Proteins', description: 'Meat, poultry, and seafood' },
  { name: 'Dairy', description: 'Milk, cheese, and dairy products' },
  { name: 'Dry Goods', description: 'Non-perishable pantry items' },
  { name: 'Beverages', description: 'Alcoholic and non-alcoholic drinks' },
  { name: 'Condiments & Sauces', description: 'Sauces, oils, and seasonings' },
  { name: 'Baking', description: 'Flour, sugar, and baking supplies' },
  { name: 'Cleaning Supplies', description: 'Cleaning and sanitation products' },
  { name: 'Paper Goods', description: 'Disposable items and packaging' },
  { name: 'Bar Supplies', description: 'Bar-specific ingredients and supplies' }
];

async function seedDatabase() {
  console.log('🌱 Starting comprehensive F&B database seed...');
  
  try {
    // Clear existing data in reverse order of dependencies
    console.log('🧹 Clearing existing data...');
    await db.delete(inventoryCountItem);
    await db.delete(inventoryCount);
    await db.delete(inventoryTransaction);
    await db.delete(inventoryItem);
    await db.delete(inventoryCategory);
    await db.delete(supplier);
    await db.delete(shiftSwapRequest);
    await db.delete(shiftAssignment);
    await db.delete(shift);
    await db.delete(employee);
    
    // Insert employees
    console.log('👥 Seeding employees...');
    const insertedEmployees = await db.insert(employee).values(employees).returning();
    console.log(`✅ Inserted ${insertedEmployees.length} employees`);
    
    // Insert suppliers
    console.log('🚚 Seeding suppliers...');
    const insertedSuppliers = await db.insert(supplier).values(suppliers).returning();
    console.log(`✅ Inserted ${insertedSuppliers.length} suppliers`);
    
    // Insert inventory categories
    console.log('📁 Seeding inventory categories...');
    const insertedCategories = await db.insert(inventoryCategory).values(categories).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Insert inventory items
    console.log('📦 Seeding inventory items...');
    const inventoryItems = [
      // Produce
      {
        name: 'Tomatoes',
        description: 'Fresh vine tomatoes',
        sku: 'PRD-TOM-001',
        categoryId: insertedCategories.find(c => c.name === 'Produce')?.id,
        unit: 'lbs',
        unitCost: '2.50',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '20',
        maximumStock: '100',
        currentStock: '45',
        location: 'Walk-in Cooler A',
        isPerishable: true,
        status: 'active' as const
      },
      {
        name: 'Lettuce',
        description: 'Romaine lettuce heads',
        sku: 'PRD-LET-001',
        categoryId: insertedCategories.find(c => c.name === 'Produce')?.id,
        unit: 'heads',
        unitCost: '1.75',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '15',
        maximumStock: '60',
        currentStock: '30',
        location: 'Walk-in Cooler A',
        isPerishable: true,
        status: 'active' as const
      },
      {
        name: 'Onions',
        description: 'Yellow onions',
        sku: 'PRD-ONI-001',
        categoryId: insertedCategories.find(c => c.name === 'Produce')?.id,
        unit: 'lbs',
        unitCost: '1.25',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '30',
        maximumStock: '150',
        currentStock: '75',
        location: 'Dry Storage',
        isPerishable: false,
        status: 'active' as const
      },
      // Proteins
      {
        name: 'Chicken Breast',
        description: 'Fresh boneless chicken breast',
        sku: 'PRO-CHK-001',
        categoryId: insertedCategories.find(c => c.name === 'Proteins')?.id,
        unit: 'lbs',
        unitCost: '4.50',
        supplierId: insertedSuppliers.find(s => s.name === 'Premium Meats Inc.')?.id,
        minimumStock: '50',
        maximumStock: '200',
        currentStock: '120',
        location: 'Walk-in Freezer',
        isPerishable: true,
        status: 'active' as const
      },
      {
        name: 'Ground Beef',
        description: '80/20 ground beef',
        sku: 'PRO-BEF-001',
        categoryId: insertedCategories.find(c => c.name === 'Proteins')?.id,
        unit: 'lbs',
        unitCost: '5.25',
        supplierId: insertedSuppliers.find(s => s.name === 'Premium Meats Inc.')?.id,
        minimumStock: '40',
        maximumStock: '160',
        currentStock: '85',
        location: 'Walk-in Freezer',
        isPerishable: true,
        status: 'active' as const
      },
      {
        name: 'Salmon Fillet',
        description: 'Fresh Atlantic salmon',
        sku: 'PRO-SAL-001',
        categoryId: insertedCategories.find(c => c.name === 'Proteins')?.id,
        unit: 'lbs',
        unitCost: '12.00',
        supplierId: insertedSuppliers.find(s => s.name === 'Ocean Fresh Seafood')?.id,
        minimumStock: '20',
        maximumStock: '80',
        currentStock: '35',
        location: 'Walk-in Cooler B',
        isPerishable: true,
        status: 'active' as const
      },
      // Dairy
      {
        name: 'Whole Milk',
        description: 'Whole milk gallons',
        sku: 'DAI-MLK-001',
        categoryId: insertedCategories.find(c => c.name === 'Dairy')?.id,
        unit: 'gallons',
        unitCost: '3.50',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '10',
        maximumStock: '40',
        currentStock: '22',
        location: 'Walk-in Cooler C',
        isPerishable: true,
        status: 'active' as const
      },
      {
        name: 'Mozzarella Cheese',
        description: 'Shredded mozzarella cheese',
        sku: 'DAI-MOZ-001',
        categoryId: insertedCategories.find(c => c.name === 'Dairy')?.id,
        unit: 'lbs',
        unitCost: '4.75',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '25',
        maximumStock: '100',
        currentStock: '55',
        location: 'Walk-in Cooler C',
        isPerishable: true,
        status: 'active' as const
      },
      // Dry Goods
      {
        name: 'All-Purpose Flour',
        description: 'All-purpose white flour',
        sku: 'DRY-FLR-001',
        categoryId: insertedCategories.find(c => c.name === 'Dry Goods')?.id,
        unit: 'lbs',
        unitCost: '0.75',
        supplierId: insertedSuppliers.find(s => s.name === 'Bakery Supplies Wholesale')?.id,
        minimumStock: '100',
        maximumStock: '500',
        currentStock: '250',
        location: 'Dry Storage',
        isPerishable: false,
        status: 'active' as const
      },
      {
        name: 'White Rice',
        description: 'Long grain white rice',
        sku: 'DRY-RIC-001',
        categoryId: insertedCategories.find(c => c.name === 'Dry Goods')?.id,
        unit: 'lbs',
        unitCost: '1.25',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '50',
        maximumStock: '200',
        currentStock: '125',
        location: 'Dry Storage',
        isPerishable: false,
        status: 'active' as const
      },
      // Beverages
      {
        name: 'Coca-Cola',
        description: 'Coca-Cola syrup for fountain',
        sku: 'BEV-COK-001',
        categoryId: insertedCategories.find(c => c.name === 'Beverages')?.id,
        unit: 'boxes',
        unitCost: '45.00',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '5',
        maximumStock: '20',
        currentStock: '12',
        location: 'Beverage Storage',
        isPerishable: false,
        status: 'active' as const
      },
      {
        name: 'House Red Wine',
        description: 'Cabernet Sauvignon',
        sku: 'BEV-WIN-001',
        categoryId: insertedCategories.find(c => c.name === 'Beverages')?.id,
        unit: 'bottles',
        unitCost: '8.50',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '24',
        maximumStock: '96',
        currentStock: '48',
        location: 'Wine Storage',
        isPerishable: false,
        status: 'active' as const
      },
      // Condiments
      {
        name: 'Olive Oil',
        description: 'Extra virgin olive oil',
        sku: 'CON-OIL-001',
        categoryId: insertedCategories.find(c => c.name === 'Condiments & Sauces')?.id,
        unit: 'liters',
        unitCost: '12.00',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '10',
        maximumStock: '40',
        currentStock: '22',
        location: 'Dry Storage',
        isPerishable: false,
        status: 'active' as const
      },
      {
        name: 'Ketchup',
        description: 'Heinz ketchup bottles',
        sku: 'CON-KET-001',
        categoryId: insertedCategories.find(c => c.name === 'Condiments & Sauces')?.id,
        unit: 'bottles',
        unitCost: '2.25',
        supplierId: insertedSuppliers.find(s => s.name === 'Fresh Produce Co.')?.id,
        minimumStock: '24',
        maximumStock: '96',
        currentStock: '60',
        location: 'Dry Storage',
        isPerishable: false,
        status: 'active' as const
      },
      // Cleaning Supplies
      {
        name: 'Dish Soap',
        description: 'Commercial dish soap',
        sku: 'CLN-DSH-001',
        categoryId: insertedCategories.find(c => c.name === 'Cleaning Supplies')?.id,
        unit: 'gallons',
        unitCost: '15.00',
        supplierId: insertedSuppliers.find(s => s.name === 'Restaurant Equipment Pro')?.id,
        minimumStock: '5',
        maximumStock: '20',
        currentStock: '12',
        location: 'Cleaning Storage',
        isPerishable: false,
        status: 'active' as const
      },
      {
        name: 'Sanitizer',
        description: 'Food-safe sanitizer',
        sku: 'CLN-SAN-001',
        categoryId: insertedCategories.find(c => c.name === 'Cleaning Supplies')?.id,
        unit: 'gallons',
        unitCost: '18.00',
        supplierId: insertedSuppliers.find(s => s.name === 'Restaurant Equipment Pro')?.id,
        minimumStock: '3',
        maximumStock: '12',
        currentStock: '7',
        location: 'Cleaning Storage',
        isPerishable: false,
        status: 'active' as const
      }
    ];
    
    const insertedItems = await db.insert(inventoryItem).values(inventoryItems).returning();
    console.log(`✅ Inserted ${insertedItems.length} inventory items`);
    
    // Create sample inventory transactions
    console.log('📝 Creating inventory transactions...');
    const manager = insertedEmployees.find(e => e.position === 'manager');
    const chef = insertedEmployees.find(e => e.position === 'chef');
    
    if (manager && chef) {
      // Initial stock purchases
      const transactions = insertedItems.slice(0, 5).map(item => ({
        inventoryItemId: item.id,
        type: 'purchase' as const,
        quantity: item.currentStock,
        unitCost: item.unitCost,
        totalCost: (parseFloat(item.currentStock) * parseFloat(item.unitCost || '0')).toFixed(2),
        previousStock: '0',
        newStock: item.currentStock,
        referenceType: 'initial_stock',
        performedBy: manager.id,
        notes: 'Initial inventory stock'
      }));
      
      await db.insert(inventoryTransaction).values(transactions);
      console.log(`✅ Created ${transactions.length} inventory transactions`);
    }
    
    // Create shifts for the next 7 days
    console.log('📅 Creating shifts...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const shiftTemplates = [
      { name: 'Morning Shift', startTime: '06:00', endTime: '14:00' },
      { name: 'Afternoon Shift', startTime: '14:00', endTime: '22:00' },
      { name: 'Evening Shift', startTime: '16:00', endTime: '00:00' }
    ];
    
    const shifts = [];
    for (let day = 0; day < 7; day++) {
      const shiftDate = addDays(today, day);
      for (const template of shiftTemplates) {
        shifts.push({
          name: template.name,
          startTime: template.startTime,
          endTime: template.endTime,
          date: shiftDate,
          status: day < 2 ? 'completed' as const : 'scheduled' as const,
          notes: day === 0 ? 'Today\'s shift' : null
        });
      }
    }
    
    const insertedShifts = await db.insert(shift).values(shifts).returning();
    console.log(`✅ Created ${insertedShifts.length} shifts`);
    
    // Assign employees to shifts
    console.log('👷 Assigning employees to shifts...');
    const activeEmployees = insertedEmployees.filter(e => e.status !== 'inactive');
    const assignments = [];
    
    // Assign employees to shifts based on their department
    for (const shiftRecord of insertedShifts) {
      // Kitchen staff for all shifts
      const kitchenStaff = activeEmployees.filter(e => e.department === 'kitchen');
      const frontStaff = activeEmployees.filter(e => e.department === 'front-of-house');
      const barStaff = activeEmployees.filter(e => e.department === 'bar');
      
      // Assign 2-3 kitchen staff per shift
      const selectedKitchen = kitchenStaff.slice(0, 3);
      for (const emp of selectedKitchen) {
        assignments.push({
          shiftId: shiftRecord.id,
          employeeId: emp.id,
          role: emp.position,
          status: shiftRecord.status === 'completed' ? 'checked-out' as const : 'scheduled' as const,
          checkInTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.startTime}:00`) : null,
          checkOutTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.endTime}:00`) : null,
          breakMinutes: shiftRecord.status === 'completed' ? 30 : 0
        });
      }
      
      // Assign 2-3 front of house staff per shift
      const selectedFront = frontStaff.slice(0, 3);
      for (const emp of selectedFront) {
        assignments.push({
          shiftId: shiftRecord.id,
          employeeId: emp.id,
          role: emp.position,
          status: shiftRecord.status === 'completed' ? 'checked-out' as const : 'scheduled' as const,
          checkInTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.startTime}:00`) : null,
          checkOutTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.endTime}:00`) : null,
          breakMinutes: shiftRecord.status === 'completed' ? 15 : 0
        });
      }
      
      // Assign 1 bartender for evening shifts
      if (shiftRecord.name.includes('Evening') && barStaff.length > 0) {
        const bartender = barStaff[0];
        assignments.push({
          shiftId: shiftRecord.id,
          employeeId: bartender.id,
          role: bartender.position,
          status: shiftRecord.status === 'completed' ? 'checked-out' as const : 'scheduled' as const,
          checkInTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.startTime}:00`) : null,
          checkOutTime: shiftRecord.status === 'completed' ? new Date(`${shiftRecord.date.toISOString().split('T')[0]}T${shiftRecord.endTime}:00`) : null,
          breakMinutes: shiftRecord.status === 'completed' ? 15 : 0
        });
      }
    }
    
    const insertedAssignments = await db.insert(shiftAssignment).values(assignments).returning();
    console.log(`✅ Created ${insertedAssignments.length} shift assignments`);
    
    // Create a sample shift swap request
    console.log('🔄 Creating shift swap requests...');
    const futureAssignments = insertedAssignments.filter(a => a.status === 'scheduled');
    if (futureAssignments.length >= 2) {
      const swapRequest = {
        requestingEmployeeId: futureAssignments[0].employeeId,
        targetEmployeeId: futureAssignments[1].employeeId,
        shiftAssignmentId: futureAssignments[0].id,
        reason: 'Personal appointment',
        status: 'pending' as const
      };
      
      await db.insert(shiftSwapRequest).values(swapRequest);
      console.log('✅ Created sample shift swap request');
    }
    
    // Create inventory counts
    console.log('📊 Creating inventory counts...');
    const inventoryCountData = {
      countDate: new Date(),
      countType: 'daily' as const,
      status: 'completed' as const,
      performedBy: chef?.id || manager?.id!,
      approvedBy: manager?.id,
      approvedAt: new Date(),
      notes: 'Daily inventory count completed',
      completedAt: new Date()
    };
    
    const [inventoryCountRecord] = await db.insert(inventoryCount).values(inventoryCountData).returning();
    
    // Add count items for some inventory items
    const countItems = insertedItems.slice(0, 5).map(item => ({
      inventoryCountId: inventoryCountRecord.id,
      inventoryItemId: item.id,
      expectedQuantity: item.currentStock,
      actualQuantity: (parseFloat(item.currentStock) * 0.95).toFixed(2), // 5% variance
      variance: (parseFloat(item.currentStock) * -0.05).toFixed(2),
      varianceValue: (parseFloat(item.currentStock) * -0.05 * parseFloat(item.unitCost || '0')).toFixed(2),
      notes: 'Minor variance due to usage'
    }));
    
    await db.insert(inventoryCountItem).values(countItems);
    console.log('✅ Created inventory count with items');
    
    // Summary
    console.log('\n📋 Seeding Summary:');
    console.log(`- ${insertedEmployees.length} employees`);
    console.log(`- ${insertedSuppliers.length} suppliers`);
    console.log(`- ${insertedCategories.length} inventory categories`);
    console.log(`- ${insertedItems.length} inventory items`);
    console.log(`- ${insertedShifts.length} shifts`);
    console.log(`- ${insertedAssignments.length} shift assignments`);
    console.log(`- Inventory transactions and counts`);
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seed function
seedDatabase().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});