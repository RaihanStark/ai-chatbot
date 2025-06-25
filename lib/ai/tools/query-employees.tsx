import { tool } from 'ai';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create a dedicated connection for the tool
const createConnection = () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not configured');
  }
  const client = postgres(process.env.POSTGRES_URL);
  return drizzle(client);
};

export const queryEmployees = tool({
  displayName: 'Query Employees Database',
  description: 'Execute SELECT queries on the Employee table to retrieve employee information. Note: The table name is "Employee" with capital E.',
  parameters: z.object({
    query: z.string().describe('The SELECT SQL query to execute on the Employee table. Table name must be "Employee" (case-sensitive).'),
  }),
  execute: async ({ query }) => {
    // Security check: Only allow SELECT queries
    const normalizedQuery = query.trim().toLowerCase();
    
    // Check if query starts with select and doesn't contain dangerous keywords
    if (!normalizedQuery.startsWith('select')) {
      return {
        error: 'Only SELECT queries are allowed',
        success: false,
      };
    }
    
    // Additional security checks for dangerous keywords
    const dangerousKeywords = [
      'insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate',
      'grant', 'revoke', 'exec', 'execute', 'call', 'merge', 'replace',
      'copy', 'import', 'load', ';select', '; select', '\\n', '\\r'
    ];
    
    const hasDangerousKeyword = dangerousKeywords.some(keyword => 
      normalizedQuery.includes(keyword)
    );
    
    if (hasDangerousKeyword) {
      return {
        error: 'Query contains restricted keywords. Only SELECT queries are allowed.',
        success: false,
      };
    }
    
    try {
      const db = createConnection();
      
      // Execute the query
      const result = await db.execute(sql.raw(query));
      
      // Format the results in a readable way
      if (result.length === 0) {
        return 'No employees found matching your query.';
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute query',
      };
    }
  },
});

// Helper function to generate example queries
export const employeeQueryExamples = [
  "SELECT * FROM \"Employee\" WHERE department = 'kitchen'",
  "SELECT firstName, lastName, position, salary FROM \"Employee\" WHERE status = 'active'",
  "SELECT COUNT(*) as total_employees FROM \"Employee\"",
  "SELECT department, COUNT(*) as count FROM \"Employee\" GROUP BY department",
  "SELECT * FROM \"Employee\" WHERE position = 'chef' OR position = 'sous-chef'",
  "SELECT firstName, lastName, hireDate FROM \"Employee\" ORDER BY hireDate DESC LIMIT 5",
  "SELECT AVG(CAST(REPLACE(REPLACE(salary, '$', ''), ',', '') AS INTEGER)) as avg_salary FROM \"Employee\" WHERE department = 'kitchen'",
];