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
  try {
    const client = postgres(process.env.POSTGRES_URL);
    return drizzle(client);
  } catch (error) {
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const executeSqlQuery = tool({
  description: 'Execute SELECT queries on the database. You have VIEW permissions only. Database schema must be provided in the prompt for access.',
  parameters: z.object({
    query: z.string().describe('The SELECT SQL query to execute. Only SELECT queries are allowed (VIEW permissions).'),
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
      
      // Drizzle execute returns an array directly
      if (!Array.isArray(result) || result.length === 0) {
        return 'No records found matching your query.';
      }
      
      return result;
    } catch (error) {
      console.error('SQL Query Error:', error);
      console.error('Query that failed:', query);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute query',
      };
    }
  },
});

