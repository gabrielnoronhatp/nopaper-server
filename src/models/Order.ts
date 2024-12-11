import { Pool } from 'pg';

export default class Order {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(orderData: any): Promise<any> {
    const { ramo, nota, valor } = orderData; 
    const result = await this.db.query(
      'INSERT INTO orders (ramo, nota, valor) VALUES ($1, $2, $3) RETURNING *',
      [ramo, nota, valor]
    );
    return result.rows[0];
  }
}
