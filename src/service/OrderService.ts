import { Pool } from 'pg';
import Order from '../models/Order';
import { OrderData } from '../types/OrderData';

export default class OrderService {
  private model: Order;
  private pool: Pool;

  constructor(model: Order, pool: Pool) {
    this.model = model;
    this.pool = pool;
  }


 

  async create(orderData: OrderData): Promise<any> {
    if (!orderData.produtosOP || orderData.produtosOP.length === 0) {
      throw new Error("produtosOP is not defined or empty.");
    }

  
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
      return result.rows; 
    } catch (error) {
      console.error('Erro ao buscar ordens de pagamento:', error);
      throw new Error('Erro ao buscar ordens de pagamento'); 
    } finally {
      client.release(); 
    }
  }

  async getOrderById(opId: number): Promise<any> {
    const client = await this.pool.connect();
    try {
      const query = `
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
          oop.id = $1
      `;
      const result = await client.query(query, [opId]);
  
      if (result.rows.length === 0) {
        throw new Error(`Ordem de Pagamento com ID ${opId} não encontrada.`);
      }
  
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar ordem de pagamento:', error);
      throw new Error('Erro ao buscar ordem de pagamento');
    } finally {
      client.release();
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

  async getItensContratados(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT ordem_id, id as idlanc, nome_produto, valor_produto, centro_custo FROM intra.op_itens ORDER BY 1,2');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar itens contratados:', error);
      throw new Error('Erro ao buscar itens contratados');
    } finally {
      client.release();
    }
  }

  async getCentrosCustoRateio(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT ordem_id, id as idlanc, centro_custo, valor FROM intra.op_centros_custo ORDER BY 1,2');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar centros de custo para rateio:', error);
      throw new Error('Erro ao buscar centros de custo para rateio');
    } finally {
      client.release();
    }
  }

  async getFormasPagamento(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT ordem_id, id as idlanc, data_vencimento, banco, agencia, conta, tipopix, chavepix FROM intra.op_parcelas ORDER BY 1,3');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      throw new Error('Erro ao buscar formas de pagamento');
    } finally {
      client.release();
    }
  }

  async getOrderDetailsById(ordemId: number): Promise<any> {
    const client = await this.pool.connect();
    try {
  
      const itensResult = await client.query(
        'SELECT id as idlanc, nome_produto, valor_produto, centro_custo FROM intra.op_itens WHERE ordem_id = $1 ORDER BY id',
        [ordemId]
      );

      
      const centrosCustoResult = await client.query(
        'SELECT id as idlanc, centro_custo, valor FROM intra.op_centros_custo WHERE ordem_id = $1 ORDER BY id',
        [ordemId]
      );

      const formasPagamentoResult = await client.query(
        'SELECT id as idlanc, data_vencimento, banco, agencia, conta, tipopix, chavepix FROM intra.op_parcelas WHERE ordem_id = $1 ORDER BY data_vencimento',
        [ordemId]
      );

  
      const orderDetails = {
        ordemId,
        itensContratados: itensResult.rows,
        centrosCusto: centrosCustoResult.rows,
        formasPagamento: formasPagamentoResult.rows,
      };

      return orderDetails;
    } catch (error) {
      console.error('Erro ao buscar detalhes da ordem:', error);
      throw new Error('Erro ao buscar detalhes da ordem');
    } finally {
      client.release();
    }
  }

  async searchOrders(params: any): Promise<any> {
    const client = await this.pool.connect();
    try {
      const queryParts: string[] = [];
      const queryValues: any[] = [];
      let index = 1;

      if (params.id) {
        queryParts.push(`CAST(oop.id AS TEXT) LIKE $${index++}`);
        queryValues.push(`${params.id}%`);
      }
      if (params.numero_nota) {
        queryParts.push(`oop.numero_nota ILIKE $${index++}`);
        queryValues.push(`%${params.numero_nota}%`);
      }
      if (params.conta_gerencial) {
        queryParts.push(`oop.conta_gerencial ILIKE $${index++}`);
        queryValues.push(`%${params.conta_gerencial}%`);
      }
      if (params.fornecedor) {
        queryParts.push(`oop.fornecedor ILIKE $${index++}`);
        queryValues.push(`%${params.fornecedor}%`);
      }
      if (params.filial) {
        queryParts.push(`oop.filial ILIKE $${index++}`);
        queryValues.push(`%${params.filial}%`);
      }
      if (params.serienf) {
        queryParts.push(`oop.serienf ILIKE $${index++}`);
        queryValues.push(`%${params.serienf}%`);
      }
      if (params.metodo) {
        queryParts.push(`oop.metodo ILIKE $${index++}`);
        queryValues.push(`%${params.metodo}%`);
      }
      if (params.quantidade_itens) {
        queryParts.push(`CAST(oop.quantidade_itens AS TEXT) ILIKE $${index++}`);
        queryValues.push(`%${params.quantidade_itens}%`);
      }
      if (params.dtlanc) {
        queryParts.push(`CAST(oop.dtlanc AS TEXT) ILIKE $${index++}`);
        queryValues.push(`%${params.dtlanc}%`);
      }

      const query = `
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
        ${queryParts.length ? 'WHERE ' + queryParts.join(' AND ') : ''}
        ORDER BY 
          oop.id DESC
      `;

      const result = await client.query(query, queryValues);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar ordens de pagamento:', error);
      throw new Error('Erro ao buscar ordens de pagamento');
    } finally {
      client.release();
    }
  }
}
