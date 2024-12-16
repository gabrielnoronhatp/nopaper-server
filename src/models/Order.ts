import { Pool } from 'pg';

export interface CentroCusto {
  centrocusto: string;
  valor: number;
}

export interface Product {
  produto: string;
  valor: number;
  centroCusto: CentroCusto[];
}

export interface OrderData {
  dtlanc: string;
  ramoOP: string;
  notaOP: string;
  qtparcelasOP: number;
  contagerencialOP: string;
  fornecedorOP: string;
  lojaOP: string;
  serieOP: string;
  metodoOP: string;
  qtitensOP: number;
  valorimpostoOP: number;
  produtosOP: Product[];
  observacaoOP: string;
  opcaoLancOP: string;
  ccustoOP: CentroCusto[];
  userOP: string;
}

export default class Order {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(orderData: OrderData): Promise<any> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Inserir ordem principal
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

      // Inserir centros de custo
      for (const cc of orderData.ccustoOP) {
        await client.query(
          'INSERT INTO intra.op_centros_custo (ordem_id, centro_custo, valor) VALUES ($1, $2, $3)',
          [ordemId, cc.centrocusto, cc.valor]
        );
      }

      // Inserir produtos
      for (const produto of orderData.produtosOP) {
        await client.query(
          'INSERT INTO intra.op_itens (ordem_id, nome_produto, valor_produto, centro_custo) VALUES ($1, $2, $3, $4)',
          [ordemId, produto.produto, produto.valor, produto.centroCusto]
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
}