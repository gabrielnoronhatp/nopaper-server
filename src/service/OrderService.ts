import { Pool } from 'pg';
import Order, { OrderData } from '../models/Order';

export default class OrderService {
  private model: Order;
  private pool: Pool;

  constructor(model: Order, pool: Pool) {
    this.model = model;
    this.pool = pool;
  }


  async testConnection(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1'); // Executa uma consulta simples
      return true; // Retorna true se a conexão for bem-sucedida
    } catch (error) {
      console.error('Erro ao testar a conexão:', error);
      return false; // Retorna false se houver um erro
    } finally {
      client.release(); // Libera o cliente de volta para o pool
    }
  }


  async create(orderData: OrderData): Promise<any> {
    if (!orderData.produtosOP || orderData.produtosOP.length === 0) {
      throw new Error("produtosOP is not defined or empty.");
    }

    // Validar valores
    const valorTotalItens = orderData.produtosOP.reduce((total, item) => total + parseFloat(String(item.valor)), 0);
    const valorTotalCentrosCustos = orderData.ccustoOP.reduce((total, cc) => total + parseFloat(String(cc.valor)), 0);
    const valorItensMenosImposto = valorTotalItens - parseFloat(String(orderData.valorimpostoOP));

    if (valorItensMenosImposto !== valorTotalCentrosCustos) {
      throw new Error('VALOR TOTAL DOS ITENS MENOS IMPOSTO, DIFERE DO VALOR DO(S) CENTRO(S) DE CUSTO(S)');
    }

    return this.model.create(orderData);
  }

  async getAllOrders(): Promise<any> {
    const client = await this.pool.connect(); 
    try {
      const result = await client.query(`
        SELECT 
          oop.id, 
          oop.filial, 
          substring(oop.fornecedor, position('-' in fornecedor) + 1, position('CNPJ' in oop.fornecedor) - 7) as fornecedor, 
          substring(oop.fornecedor, position('CNPJ' in fornecedor) + 5, 20) as cnpj, 
          oop.conta_gerencial as contagerencial, 
          upper(oop.metodo) as formapag, 
          concat('NF:', oop.numero_nota, ' SERIE:', oop.serienf) as notafiscal, 
          oop.quantidade_parcelas as parcelas, 
          oop.quantidade_itens as itens, 
          ite.valor, 
          upper(assinatura1) assinatura1, 
          dtassinatura1, 
          upper(assinatura2) assinatura2, 
          dtassinatura2, 
          upper(assinatura3) assinatura3, 
          dtassinatura3 
        FROM 
          intra.op_ordem_pagamento oop 
        INNER JOIN  
          (SELECT ordem_id id, sum(valor_produto) as valor FROM intra.op_itens GROUP BY ordem_id) ite 
        ON 
          ite.id = oop.id 
        WHERE 
          (dtassinatura1 IS NULL OR dtassinatura2 IS NULL OR dtassinatura3 IS NULL) 
        ORDER BY 
          oop.id DESC
      `);
      return result.rows; // Return the rows from the query
    } catch (error) {
      console.error('Erro ao buscar ordens de pagamento:', error);
      throw new Error('Erro ao buscar ordens de pagamento'); // Throw an error if something goes wrong
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  async getContasGerenciais(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT resumo AS conta FROM wint.pcconta WHERE COALESCE(tipo, \'N\') <> \'I\' ORDER BY codconta ASC');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar dados conta gerencial:', error);
      throw new Error('Erro ao buscar dados conta gerencial');
    } finally {
      client.release();
    }
  }

  async searchContasGerenciais(query: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT resumo AS conta FROM wint.pcconta WHERE COALESCE(tipo, \'N\') <> \'I\' AND resumo LIKE $1 ORDER BY conta ASC LIMIT 6',
        [`%${query}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar conta gerencial:', error);
      throw new Error('Erro ao buscar conta gerencial');
    } finally {
      client.release();
    }
  }

  async getCentrosCusto(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT resumo AS centrocusto FROM wint.pccentrocusto ce WHERE recebe_lancto=\'S\' AND ativo=\'S\' ORDER BY codigocentrocusto ASC');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar dados centro de custo:', error);
      throw new Error('Erro ao buscar dados centro de custo');
    } finally {
      client.release();
    }
  }

  async searchCentrosCusto(query: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT resumo AS centrocusto FROM wint.pccentrocusto ce WHERE recebe_lancto=\'S\' AND ativo=\'S\' AND resumo LIKE $1 ORDER BY codigocentrocusto ASC LIMIT 10',
        [`%${query}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar centro de custo:', error);
      throw new Error('Erro ao buscar centro de custo');
    } finally {
      client.release();
    }
  }
}
