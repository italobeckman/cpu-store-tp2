import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { estadoResolver } from './components/estado/estado.resolver';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { cidadeResolver } from './components/cidade/cidade.resolver';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './components/fornecedor/fornecedor.resolver';
import { EnderecoListComponent } from './components/endereco/endereco-list/endereco-list.component';
import { EnderecoFormComponent } from './components/endereco/endereco-form/endereco-form.component';
import { PlacaIntegradaListComponent } from './components/placa-integrada/placa-integrada-list/placa-integrada-list.component';
import { PlacaIntegradaFormComponent } from './components/placa-integrada/placa-integrada-form/placa-integrada-form.component';
import { ProcessadorListComponent } from './components/processador/processador-list/processador-list.component';
import { ProcessadorFormComponent } from './components/processador/processador-form/processador-form.component';
import { ProcessadorResolver } from './components/processador/processador.resolver';
import { AdminHomeComponent } from './components/template/admin-home/admin-home.component';
import { placaIntegrada } from './components/placa-integrada/placa-integrada.resolver';
import { FabricanteListComponent } from './components/fabricante/fabrocante-list/fabrocante-list.component';
import { FabrocanteFormComponent } from './components/fabricante/fabrocante-form/fabrocante-form.component';
import { fabricanteResolver } from './components/fabricante/fabricante-resolver.resolver';
import { UsuarioResolver } from './components/usuario/usuario-list/usuario.resolver';
import { NotFound404Component } from './components/not-found-404/not-found-404.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { DetalhesProcessadorComponent } from './components/home/detalhes-processador/detalhes-processador.component';
import { detalhesProcessadorResolver } from './components/home/detalhes-processador/detalhes-processador.resolver';
//import { ToolbarComponent } from  './components/toolbar/toolbar.component';
import { CarinhoProcessadorComponent } from './components/home/carinho-processador/carinho-processador.component';
import { TemplateComponent } from './components/templateUser/template/template.component';
import { ResumoPagamentoComponent } from './components/pagamento/pagamento.component';
import { AdicionarCartaoComponent } from './components/pagamento/adicionar-cartao/adicionar-cartao.component';
import { AdicionarEnderecoComponent } from './components/pagamento/adicionar-endereco/adicionar-endereco.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { AuthGuard } from './guards/auth.guard';
import { SobreComponent } from './components/sobre/sobre.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { LoteResolver } from './components/lote/lote.resolver';
import { ListaDesejoComponent } from './components/usuario/lista-desejo/lista-desejo.component';
import { Component } from '@angular/core';
export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    title: 'Telas de Usuário',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'perfil',
        component: PerfilComponent,
        title: 'Perfil do Usuário',
        canActivate: [AuthGuard],
      },
      {
        path: 'pedidos',
        component: PedidosComponent,
        title: 'Meus Pedidos',
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Tela de Login',
      },
      {
        path: 'cadastro',
        component: CadastroComponent,
        title: 'Cadastro',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'detalhes/:id',
        component: DetalhesProcessadorComponent,
        title: 'Detalhes do Processador',
        resolve: { processador: detalhesProcessadorResolver },
      },
      {
        path: 'carrinho',
        component: CarinhoProcessadorComponent,
        title: 'Carrinho de Compras',
      },
      {
        path: 'pagamento',
        component: ResumoPagamentoComponent,
        title: 'Tela de pagamento',
      },
      {
        path: 'pagamento/adicionar_cartao',
        component: AdicionarCartaoComponent,
      },
      {
        path: 'sobre',
        component: SobreComponent,
      },
      {
        path: 'produtos',
        component: ProdutosComponent,
      },
      {
        path: 'desejos',
        component: ListaDesejoComponent,
        canActivate: [AuthGuard],
        
      },
      {
        path: 'enderecos/adicionar',
        component: EnderecoFormComponent,
      }
    ],
  },
  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administrativo',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['Super', 'Admin'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        component: AdminHomeComponent,
        title: 'Home',
      },
      // Estados
      {
        path: 'estados',
        component: EstadoListComponent,
        title: 'Lista de Estados',
      },
      {
        path: 'estados/new',
        component: EstadoFormComponent,
        title: 'Novo Estado',
      },
      {
        path: 'estados/edit/:id',
        component: EstadoFormComponent,
        resolve: { estado: estadoResolver },
        title: 'Edição de Estado',
      },

      // Cidades
      {
        path: 'cidades',
        component: CidadeListComponent,
        title: 'Lista de Cidades',
      },
      {
        path: 'cidades/new',
        component: CidadeFormComponent,
        title: 'Nova Cidade',
      },
      {
        path: 'cidades/edit/:id',
        component: CidadeFormComponent,
        resolve: { cidade: cidadeResolver },
        title: 'Edição de Cidade',
      },

      // Usuários
      {
        path: 'usuarios',
        component: UsuarioListComponent,
        title: 'Listagem de Usuário',
      },
      {
        path: 'usuarios/new',
        component: UsuarioFormComponent,
        title: 'Cadastro de Usuário',
      },
      {
        path: 'usuarios/edit/:id',
        component: UsuarioFormComponent,
        resolve: { usuario: UsuarioResolver },
        title: 'Edição de Usuário',
      },

      // Fabricantes
      {
        path: 'fabricantes',
        component: FabricanteListComponent,
        title: 'Listagem de Fabricantes',
      },
      {
        path: 'fabricantes/new',
        component: FabrocanteFormComponent,
        title: 'Cadastro de Fabricante',
      },
      {
        path: 'fabricantes/edit/:id',
        component: FabrocanteFormComponent,
        resolve: { fabricante: fabricanteResolver },
        title: 'Edição de Fabricante',
      },

      // Fornecedores
      {
        path: 'fornecedores',
        component: FornecedorListComponent,
        title: 'Listagem de Fornecedores',
      },
      {
        path: 'fornecedores/new',
        component: FornecedorFormComponent,
        title: 'Novo Fornecedor',
      },
      {
        path: 'fornecedores/edit/:id',
        component: FornecedorFormComponent,
        resolve: { fornecedor: fornecedorResolver },
        title: 'Edição de Fornecedor',
      },

      // Endereços
      {
        path: 'enderecos',
        component: EnderecoListComponent,
        title: 'Listagem de Endereços',
      },
      {
        path: 'enderecos/new',
        component: EnderecoFormComponent,
        title: 'Cadastro de Endereços',
      },

      // Placas Integradas
      {
        path: 'placasintegradas',
        component: PlacaIntegradaListComponent,
        title: 'Listagem de Placas Integradas',
      },
      {
        path: 'placasintegradas/new',
        component: PlacaIntegradaFormComponent,
        title: 'Cadastro de Placas Integradas',
      },
      {
        path: 'placasintegradas/edit/:id',
        component: PlacaIntegradaFormComponent,
        title: 'Edição de Placas Integradas',
      },

      // Processadores
      {
        path: 'processadores',
        component: ProcessadorListComponent,
        title: 'Listagem de Processadores',
      },
      {
        path: 'processadores/new',
        component: ProcessadorFormComponent,
        title: 'Cadastro de Processadores',
      },
      {
        path: 'processadores/edit/:id',
        component: ProcessadorFormComponent,
        resolve: { processador: ProcessadorResolver },
        title: 'Edição de Processadores',
      },

      {
        path: 'lotes',
        component: LoteListComponent,
        title: 'Listagem de Lotes',
      },

      {
        path: 'lotes/new',
        component: LoteFormComponent,
        title: 'Cadastro de Lotes',
      },
      {
        path: 'lotes/edit/:id',
        component: LoteFormComponent,
        resolve: { lote: LoteResolver },
        title: 'Edição de Lotes',
      },
    ],
  },
  {
    path: '**',
    component: NotFound404Component,
    title: 'Página não encontrada',
  },
];
