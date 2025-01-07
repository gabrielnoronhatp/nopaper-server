import { CentroCusto } from "./CentroCusto";


export interface Product {
    produto: string;
    valor: number;
    centroCusto: CentroCusto[];
  }