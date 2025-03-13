import { CentroCusto } from "./CentroCusto";
import { Product } from "./Product";

export interface Parcela {
    metodo: string;
    tipopix: string;
    chavepix: string;
    banco: string;
    agencia: string;
    conta: string;
    qtparcelas: number;
    dates: string[];
    parcela: string;
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
    dtavistaOP?: string | null;
    bancoOP?: string | null;
    agenciaOP?: string | null;
    contaOP?: string | null;
    dtdepositoOP?: string;
    parcelasOP: Array<{
        parcela: number | null;
        banco: string;
        agencia: string;
        conta: string;
        tipopix: string;
        chavepix: string;
    }>;
    produtosOP: Array<{
        produto: string;
        valor: number;
        centroCusto: string[];
    }>;
    observacaoOP?: string | null;
    tipopixOP?: string;
    chavepixOP?: string;
    datapixOP?: string;
    opcaoLancOP?: string;
    ccustoOP: Array<{
        centrocusto: string;
        valor: number;
    }>;
    userOP: string;
    dataVencimentoOP?: string;
}
  