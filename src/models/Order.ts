import { Pool } from 'pg';
import { OrderData } from '../types/OrderData';


export default class Order {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(orderData: OrderData): Promise<any> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      const insertOrdem = `
        INSERT INTO intra.op_ordem_pagamento (
          ramo, numero_nota, quantidade_parcelas, conta_gerencial, 
          fornecedor, filial, serienf, metodo, quantidade_itens, 
          vlimposto, dtlanc, observacao, tipo_lanc, userid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING id;
      `;
      
      const ordemResult = await client.query(insertOrdem, [
        orderData.ramoOP,
        orderData.notaOP,
        orderData.qtparcelasOP,
        orderData.contagerencialOP,
        orderData.fornecedorOP,
        orderData.lojaOP,
        orderData.serieOP,
        orderData.metodoOP,
        orderData.qtitensOP,
        orderData.valorimpostoOP,
        orderData.dtlanc,
        orderData.observacaoOP,
        orderData.opcaoLancOP,
        orderData.userOP
      ]);

      const ordemId = ordemResult.rows[0].id;

      // Inserir em op_centros_custo
      for (const cc of orderData.ccustoOP) {
        await client.query(
          'INSERT INTO intra.op_centros_custo (ordem_id, centro_custo, valor) VALUES ($1, $2, $3)',
          [ordemId, cc.centrocusto, cc.valor]
        );
      }

      // Inserir em op_itens
      for (const produto of orderData.produtosOP) {
        await client.query(
          'INSERT INTO intra.op_itens (ordem_id, nome_produto, valor_produto, centro_custo) VALUES ($1, $2, $3, $4)',
          [ordemId, produto.produto, produto.valor, produto.centroCusto]
        );
      }

      // Inserir em op_parcelas
      for (const parcela of orderData.parcelasOP) {
        await client.query(
          `
          INSERT INTO intra.op_parcelas (
            ordem_id, data_vencimento, banco, agencia, conta, tipopix, chavepix
          ) VALUES ($1, $2, $3, $4, $5, $6, $7);
          `,
          [
            ordemId,
            parcela.parcela,        // data_vencimento
            parcela.banco,
            parcela.agencia,
            parcela.conta,
            parcela.tipopix,
            parcela.chavepix
          ]
        );
      }

      await client.query('COMMIT');
      return { success: true, id: ordemId };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async searchOrders(params: any): Promise<any> {
    const client = await this.db.connect();
    try {
      const queryParts = [];
      const queryValues = [];
      let index = 1;

      for (const [key, value] of Object.entries(params)) {
        if (value) {
          queryParts.push(`${key} = $${index}`);
          queryValues.push(value);
          index++;
        }
      }

      const query = `
        SELECT * FROM intra.op_ordem_pagamento
        WHERE ${queryParts.join(' AND ')}
      `;

      const result = await client.query(query, queryValues);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}