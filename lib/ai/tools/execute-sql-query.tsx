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
    
    // Additional security checks for dangerous SQL statements
    // Check for dangerous patterns that indicate non-SELECT operations
    const dangerousPatterns = [
      /;\s*insert/i,
      /;\s*update/i,
      /;\s*delete/i,
      /;\s*drop/i,
      /;\s*create/i,
      /;\s*alter/i,
      /;\s*truncate/i,
      /;\s*grant/i,
      /;\s*revoke/i,
      /^\s*insert/i,
      /^\s*update/i,
      /^\s*delete/i,
      /^\s*drop/i,
      /^\s*create/i,
      /^\s*alter/i,
      /^\s*truncate/i,
      /^\s*grant/i,
      /^\s*revoke/i,
      /^\s*exec/i,
      /^\s*execute/i,
      /^\s*call/i,
      /^\s*merge/i,
      /^\s*replace/i,
      /^\s*copy/i,
      /^\s*import/i,
      /^\s*load/i
    ];
    
    const hasDangerousPattern = dangerousPatterns.some(pattern => 
      pattern.test(query)
    );
    
    if (hasDangerousPattern) {
      return {
        error: 'Query contains restricted keywords. Only SELECT queries are allowed.',
        success: false,
      };
    }
    
    // Check for multiple statements (semicolon not in quotes)
    const semicolonOutsideQuotes = /;(?=(?:[^']*'[^']*')*[^']*$)/;
    if (semicolonOutsideQuotes.test(query.trim().slice(0, -1))) {
      return {
        error: 'Multiple statements are not allowed. Only single SELECT queries are permitted.',
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

