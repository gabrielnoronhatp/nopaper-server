import { sqlServerPool } from "../config/database";

   
  

   describe('Database Connection', () => {
     it('should connect to SQL Server database', async () => {
       try {
         await sqlServerPool.connect();
         expect(true).toBe(true); // Se conectar, o teste passa
       } catch (error) {
         expect(error).toBeNull(); // Se falhar, o teste falha
       } finally {
         await sqlServerPool.close(); // Fechar a conexão após o teste
       }
     });
   });