import { pgPool } from '../config/database';
import { Supplier } from '../types/Supplier';

export class SupplierService {
  static async getSuppliers(searchQuery: string): Promise<Supplier[]> {
    try {
      const result = await pgPool.query(
        `SELECT resumo AS fornecedor 
         FROM wint.pcfornec 
         WHERE regexp_replace(resumo, '^[0-9]+-', '') ILIKE $1 
         LIMIT 10`,
         [`%${searchQuery}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      throw new Error('Erro ao buscar fornecedores');
    }
  }
} 