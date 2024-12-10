import Order from '../models/Order';

export default class OrderService {
  private model: Order;

  constructor(model: Order) {
    this.model = model;
  }

  async create(data: any): Promise<any> {
    // Validar e manipular os dados
    return this.model.create(data);
  }
}
