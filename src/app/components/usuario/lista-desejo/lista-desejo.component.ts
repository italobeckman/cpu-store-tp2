import { Component, OnInit } from '@angular/core';
import { Processador } from '../../../models/processador.model';
import { ListaDesejoService } from '../../../services/lista-desejo.service';
import { ProcessadorService } from '../../../services/processador.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../../services/carrinho.service';

@Component({
  selector: 'app-lista-desejo',
  templateUrl: './lista-desejo.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./lista-desejo.component.css'],
})
export class ListaDesejoComponent implements OnInit {
  listaDesejos: Processador[] = [];
  loading = false;
  erro: string | null = null;

  constructor(
    private listaDesejoService: ListaDesejoService,
    private processadorService: ProcessadorService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.carregarListaDesejos();
  }

  carregarListaDesejos(): void {
    this.loading = true;
    this.listaDesejoService.getListaDeDesejos().subscribe({
      next: (dados) => {
        this.listaDesejos = dados;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar lista de desejos';
        this.loading = false;
      },
    });
  }

  removerDaLista(processadorId: number): void {
    this.listaDesejoService.removeFromListaDeDesejos(processadorId).subscribe({
      next: () => {
        this.listaDesejos = this.listaDesejos.filter(
          (p) => p.id !== processadorId
        );
      },
      error: () => {
        this.erro = 'Erro ao remover item da lista de desejos';
      },
    });
  }

  getPrimeiraImagemUrl(processador: Processador): string {
    if (processador.imagens && processador.imagens.length > 0) {
      return this.processadorService.getImageUrl(processador.imagens[0]);
    }
    return 'assets/imagem-padrao.png';
  }

  comprar(processador: Processador): void {
    console.log(`Comprando processador: ${processador.nome}`);

    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
      desconto: processador.desconto,
    });

  }
  
}
