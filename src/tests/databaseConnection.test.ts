import { sqlServerPool } from "../config/database";

   describe('Database Connection', () => {
     it('should connect to SQL Server database', async () => {
       try {
         await sqlServerPool.connect();
         expect(true).toBe(true); 
       } catch (error) {
         expect(error).toBeNull(); 
       } finally {
         await sqlServerPool.close(); 
       }
     });
   });