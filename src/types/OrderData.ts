import { CentroCusto } from "./CentroCusto";
import { Product } from "./Product";




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
  