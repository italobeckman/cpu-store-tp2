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

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administrativo',
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'estados' 
      },
      // Rotas de Home
{
  path: 'home',
  component: AdminHomeComponent
  , title: 'Home'
},





      // Rotas de Estado
      {
        path: 'estados',
        component: EstadoListComponent,
        title: 'Lista de Estados',
      },
      { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' },
      {
        path: 'estados/edit/:id',
        component: EstadoFormComponent,
        title: 'Edição de Estado',
        resolve: { estado: estadoResolver },
      },

      // Rotas de Cidade
      {
        path: 'cidades',
        component: CidadeListComponent,
        title: 'Lista de Cidades',
      },
      { path: 'cidades/new', component: CidadeFormComponent, title: 'Nova Cidade' },
      {
        path: 'cidades/edit/:id',
        component: CidadeFormComponent,
        title: 'Edição de Cidade',
        resolve: { cidade: cidadeResolver },
      },

      // Rotas de Usuário
      {
        path: 'usuarios',
        component: UsuarioListComponent,
        title: 'Listagem de usuário',
      },
      {
        path: 'usuarios/new',
        component: UsuarioFormComponent,
        title: 'Cadastro de Usuário',
      },
      {
        path: 'usuarios/edit/:id',
        component: UsuarioFormComponent,
        title: 'Edição de Usuário'
      },

      {
        path: 'fabricantes',
        component: FabricanteListComponent,
        title: 'Listagem de Fabricantes'
      },
      {
        path: 'fabricantes/new',
        component: FornecedorFormComponent,
        title: 'Cadastro de Fabricante',
      },
      {
        path: 'fabricante/new/:id',
        component: FornecedorFormComponent,
        title: 'Edição de Fabricante',
        resolve: { fabricante: fabricanteResolver },
      },

      // Rotas de Fornecedor
      {
        path: 'fornecedores',
        component: FornecedorListComponent,
        title: 'Listagem de Fornecedores',
      },
      { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor' },
      {
        path: 'fornecedores/edit/:id',
        component: FornecedorFormComponent,
        title: 'Edição de Fornecedor',
        resolve: { fornecedor: fornecedorResolver },
      },

      // Rotas de Endereço
      {
        path: 'enderecos',
        component: EnderecoListComponent,
        title: 'Listafem de Endereços',
      },
      {
        path: 'enderecos/new',
        component: EnderecoFormComponent,
        title: 'Cadastro de Endereços',
      },
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
        resolve: {
          processador : ProcessadorResolver
        }
      }
    ]
  },
  
];