import { pgPool } from '../config/database';
import { Store } from '../types/Store';

export class StoreService {
  static async getAllStores(): Promise<Store[]> {
    try {
      const result = await pgPool.query(
        'SELECT UPPER(fantasia) AS loja FROM public.dimfilial'
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar dados lojas:', error);
      throw new Error('Erro ao buscar dados lojas');
    }
  }

  static async searchStores(searchQuery: string): Promise<Store[]> {
    try {
      const result = await pgPool.query(
        'SELECT UPPER(fantasia) AS loja FROM public.dimfilial WHERE idempresa IN (1,2,3,4,8,15) AND UPPER(fantasia) LIKE $1 ORDER BY idempresa',
        [`%${searchQuery}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      throw new Error('Erro ao buscar lojas');
    }
  }
} 