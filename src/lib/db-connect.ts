import { prisma } from './prisma';

/**
 * Utility function to execute database operations with retry logic
 * @param operation - The database operation to execute
 * @param maxRetries - Maximum number of retry attempts
 * @param delay - Delay between retries in milliseconds
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on connection errors
      if (
        error.code === 'P1001' || // Error connecting to database
        error.code === 'P1002' || // Database server timeout
        error.message?.includes("Can't reach database server")
      ) {
        console.warn(`Database connection attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        continue;
      }
      
      // For other errors, don't retry
      throw error;
    }
  }
  
  // If we've exhausted all retries
  console.error(`Failed to connect to database after ${maxRetries} attempts`);
  throw lastError;
}

/**
 * Check if the database is accessible
 * @returns True if database is connected, false otherwise
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Test the connection
    const isConnected = await withRetry(async () => {
      return await checkDatabaseConnection();
    });
    
    if (isConnected) {
      console.log('Database connection established successfully');
    } else {
      console.error('Failed to establish database connection');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}