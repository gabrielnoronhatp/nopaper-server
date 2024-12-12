import Order, { OrderData } from '../models/Order';

export default class OrderService {
  private model: Order;

  constructor(model: Order) {
    this.model = model;
  }

  async create(data: OrderData): Promise<any> {
    // Validar valores
    const valorTotalItens = data.produtosOP.reduce((total, item) => total + parseFloat(String(item.valor)), 0);
    const valorTotalCentrosCustos = data.ccustoOP.reduce((total, cc) => total + parseFloat(String(cc.valor)), 0);
    const valorItensMenosImposto = valorTotalItens - parseFloat(String(data.valorimpostoOP));

    if (valorItensMenosImposto !== valorTotalCentrosCustos) {
      throw new Error('VALOR TOTAL DOS ITENS MENOS IMPOSTO, DIFERE DO VALOR DO(S) CENTRO(S) DE CUSTO(S)');
    }

    return this.model.create(data);
  }
}
