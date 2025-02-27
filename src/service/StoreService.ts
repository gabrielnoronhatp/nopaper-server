import { pgPool } from '../config/database';
import { Store } from '../types/Store';

export class StoreService {
  static async getAllStores(searchQuery?: string, id?: number): Promise<Store[]> {
    try {
      let query = `
        SELECT UPPER(fantasia) AS loja
        FROM public.dimfilial
      `;

      const conditions: string[] = [];
      const params: any[] = [];

      if (searchQuery) {
        conditions.push(`UPPER(fantasia) LIKE $${params.length + 1}`);
        params.push(`%${searchQuery.toUpperCase()}%`);
      }

      if (id !== undefined) {
        conditions.push(`id = $${params.length + 1}`);
        params.push(id);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      const result = await pgPool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar dados lojas:', error);
      throw new Error('Erro ao buscar dados lojas');
    }
  }

  static async searchStores(searchQuery: string, ramo: string): Promise<Store[]> {
    try {
      let query = `
        SELECT UPPER(d.fantasia) AS loja
        FROM public.dimfilial d
      `;

      const searchPattern = `%${searchQuery.toUpperCase()}%`;

    
      const allowedIds = (ramo.toLowerCase() === "distribuicao" || ramo.toLowerCase() === "distribuição")
        ? [1, 3, 4, 8]
        : [2, 15, 81, 126];

      query += `
        WHERE d.idempresa = ANY($1)
          AND UPPER(d.fantasia) LIKE $2
        ORDER BY d.idempresa
      `;

      const result = await pgPool.query(query, [allowedIds, searchPattern]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      throw new Error("Erro ao buscar lojas");
    }
  }
} 