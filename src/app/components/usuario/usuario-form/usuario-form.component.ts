import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioParaRetorno } from '../../../models/usuario_para_retorno.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  valido: boolean = false
  formUsuario!: FormGroup
  usuarioSerchedByCpf!: UsuarioParaRetorno
  isEdicao: boolean = false;
  usuarioId: number | null = null;

  perfis = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuário', value: 'USER' }
  ];

  cargos = [
    { label: 'Gerente de Vendas', value: 'GERENTE_VENDAS' },
    { label: 'Analista de Estoque', value: 'ANALISTA_ESTOQUE' },
    { label: 'Atendente', value: 'ATENDENTE' },
    { label: 'Gerente de Logística', value: 'GERENTE_LOGISTICA' },
    { label: 'Especialista em E-commerce', value: 'ESPECIALISTA_ECOMMERCE' },
    { label: 'Marketing Digital', value: 'MARKETING_DIGITAL' },
    { label: 'Financeiro', value: 'FINANCEIRO' },
    { label: 'Suporte ao Cliente', value: 'SUPORTE_CLIENTE' }
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private usuarioService: UsuarioService, 
    private datePipe: DatePipe,
    private route: ActivatedRoute // Adicionado o ActivatedRoute
  ) {}

  findUserByCpf(cpf: string) {
    this.usuarioService.findByCpfS(cpf).subscribe(data => {
      this.usuarioSerchedByCpf = data
      console.log(this.usuarioSerchedByCpf)
      if(this.usuarioSerchedByCpf){
        console.log("aQuii")
        console.log(this.usuarioSerchedByCpf)
        this.ngOnInit()
      }
    })
  }

  ngOnInit(): void {
    this.formUsuario = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      categoria: ['', Validators.required],
      cargo: [''],
      salario: [''],
    });

    // Verificar se há dados do resolver (modo de edição)
    this.route.data.subscribe(data => {
      const usuario = data['usuario'];
      if (usuario) {
        this.isEdicao = true;
        this.usuarioId = usuario.id;
        
        // Preencher o formulário com os dados do usuário
        this.formUsuario.patchValue({
          id: usuario.id,
          username: usuario.username,
          cpf: usuario.cpf,
          email: usuario.email,
          senha: '****************', // Não exibir a senha real
          dataNascimento: new Date(usuario.dataNascimento),
          categoria: usuario.categoria
        });

        // Se telefone for um objeto com codigoArea e numero
        if (usuario.telefone && usuario.telefone.codigoArea && usuario.telefone.numero) {
          this.formUsuario.get('telefone')?.setValue(
            `+${usuario.telefone.codigoArea} ${usuario.telefone.numero}`
          );
        }

        // Se for funcionário, preencher os campos adicionais
        if (usuario.funcionario) {
          this.formUsuario.get('cargo')?.setValue(usuario.funcionario.cargo);
          this.formUsuario.get('salario')?.setValue(usuario.funcionario.salario);
        }

        this.valido = true;
        this.formUsuario.markAllAsTouched();
      }
    });

    if (this.usuarioSerchedByCpf != null && !this.isEdicao) {
      this.valido = true
      this.formUsuario.get('email')?.setValue(this.usuarioSerchedByCpf.email);
      this.formUsuario.get('username')?.setValue(this.usuarioSerchedByCpf.username);
      this.formUsuario.get('cpf')?.setValue(this.usuarioSerchedByCpf.cpf);
      this.formUsuario.get('senha')?.setValue("*****************");

      this.formUsuario.get('dataNascimento')?.setValue(new Date(this.usuarioSerchedByCpf.dataNascimento));
      console.log("/*//")
      console.log(this.formUsuario.get('dataNascimento')?.value)

      this.formUsuario.get('telefone')?.setValue(`+${this.usuarioSerchedByCpf.telefone.codigoArea} ${this.usuarioSerchedByCpf.telefone.numero}`);

      this.formUsuario.updateValueAndValidity();
      this.formUsuario.markAllAsTouched();
    }
  
    // Se quiser limpar os campos quando a categoria mudar
    this.formUsuario.get('categoria')?.valueChanges.subscribe(value => {
      if (value !== 'SUPER') {
        this.formUsuario.get('cargo')?.reset();
        this.formUsuario.get('salario')?.reset();
      }
    });
  }
 
  async salvar(): Promise<void> {
    if (this.formUsuario.valid) {
      const usuario = this.formUsuario.value;
      console.log('Usuário a ser salvo:', usuario);

      try {
        if (this.isEdicao && this.usuarioId) {
          // Se estiver em modo de edição, chama o método de atualização
          (await this.usuarioService.update(usuario)).subscribe(() => {
            this.router.navigate(['/admin/usuarios']);
          });
        } else {
          // Se estiver em modo de criação, chama o método de inserção
          (await this.usuarioService.insert(usuario)).subscribe(() => {
            this.router.navigate(['/admin/usuarios']);
          });
        }
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
      }
    }
  }
}