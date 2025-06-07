export class PedidoRequest {
  idEndereco!: number;
  listaItemPedido!: ItemPedidoRequest[];
}

export class ItemPedidoRequest {
  idProcessador!: number;
  quantidade!: number;
}

export class StatusPedido {
  id!: number;
  label!: string; // Ex: "Preparando produto"
}

export class TipoPagamento {
  id!: number;
  label!: string; // Ex: "Crédito"
}

export class Pagamento {
  id!: number;
  tipoPagamento!: string; // Ex: "Cartão"
  nomeTitular!: string;
  numero!: string;
  cpf!: string;
  validade!: string; // ou Date
  cvc!: number;
  tipo!: TipoPagamento;
}

export class Estado {
  id!: number;
  nome!: string;
  sigla!: string;
}

export class Cidade {
  id!: number;
  nome!: string;
  estado!: Estado;
}

export class Endereco {
  id!: number;
  logradouro!: string;
  cep!: string;
  bairro!: string;
  complemento!: string;
  numero!: number;
  cidade!: Cidade;
}

export class ItemPedido {
  idProcessador!: number;
  nome!: string;
  quantidade!: number;
  valor!: number;
}

export class PedidoResponse {
  id!: number;
  data!: string; // ou Date
  valorTotal!: number;
  statusPedido!: StatusPedido;
  pagamento!: Pagamento;
  endereco!: Endereco;
  listaItemPedido!: ItemPedido[];
}
