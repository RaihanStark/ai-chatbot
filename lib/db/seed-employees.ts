import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { employee } from './schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure the POSTGRES_URL environment variable is set
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

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

async function seedEmployees() {
  console.log('🌱 Seeding employees table...');
  
  try {
    // Insert all employees
    const insertedEmployees = await db.insert(employee).values(employees).returning();
    
    console.log(`✅ Successfully seeded ${insertedEmployees.length} employees`);
    
    // Display some of the inserted data
    console.log('\n📋 Sample of inserted employees:');
    insertedEmployees.slice(0, 5).forEach(emp => {
      console.log(`- ${emp.firstName} ${emp.lastName} (${emp.position}) - ${emp.department}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seed function
seedEmployees().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});