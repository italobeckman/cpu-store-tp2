import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/Produto.model';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private produtos: Produto[] = [];
  private produtosSubject = new BehaviorSubject<Produto[]>(this.produtos);

  constructor() {
    // Tenta carregar carrinho genérico do sessionStorage ao iniciar
    const carrinhoSalvo = sessionStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.produtos = JSON.parse(carrinhoSalvo);
      this.produtosSubject.next(this.produtos);
    }
  }

  obterProdutos() {
    return this.produtosSubject.asObservable();
  }

  adicionarProduto(produto: Produto) {
    const index = this.produtos.findIndex(p => p.id === produto.id);

    console.log("Adicionando produto:", produto);

    if (index > -1) {
      const produtoExistente = { ...this.produtos[index] };
      produtoExistente.quantidade += 1;
      this.produtos = [
        ...this.produtos.slice(0, index),
        produtoExistente,
        ...this.produtos.slice(index + 1)
      ];
    } else {
      this.produtos = [...this.produtos, { ...produto, quantidade: 1 }];
    }

    this.atualizarStorage();
  }

  limparCarrinho() {
    this.produtos = [];
    this.atualizarStorage();
  }
  
  removerProduto(produtoId: number) {
    this.produtos = this.produtos.filter(p => p.id !== produtoId);
    this.atualizarStorage();
  }

  aumentarQuantidade(produtoId: number) {
    const index = this.produtos.findIndex(p => p.id === produtoId);
    if (index > -1) {
      const produto = { ...this.produtos[index] };
      produto.quantidade += 1;
      this.produtos = [
        ...this.produtos.slice(0, index),
        produto,
        ...this.produtos.slice(index + 1)
      ];
      this.atualizarStorage();
    }
  }

  diminuirQuantidade(produtoId: number) {
    const index = this.produtos.findIndex(p => p.id === produtoId);
    if (index > -1) {
      const produto = { ...this.produtos[index] };
      if (produto.quantidade > 1) {
        produto.quantidade -= 1;
        this.produtos = [
          ...this.produtos.slice(0, index),
          produto,
          ...this.produtos.slice(index + 1)
        ];
      } else {
        this.produtos = this.produtos.filter(p => p.id !== produtoId);
      }
      this.atualizarStorage();
    }
  }

  obterTotal() {
    return this.produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  }

  private atualizarStorage() {
    this.produtosSubject.next(this.produtos);
    sessionStorage.setItem('carrinho', JSON.stringify(this.produtos));
  }
}
