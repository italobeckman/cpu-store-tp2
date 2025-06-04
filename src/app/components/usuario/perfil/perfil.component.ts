import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  PerfilService,
  PerfilUsuario,
  CartaoRequestDTO,
  CartaoResponseDTO,
  EnderecoRequestDTO,
  EnderecoResponseDTO,
} from '../../../services/perfil.service';
import { EstadoService } from '../../../services/estado.service';
import { CidadeService } from '../../../services/cidade.service';
import { Estado } from '../../../models/estado.model';
import { Cidade } from '../../../models/cidade.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  // Dados do usuário
  perfilUsuario: PerfilUsuario | null = null;
  enderecos: EnderecoResponseDTO[] = [];
  cartoes: CartaoResponseDTO[] = [];

  // Estados da interface
  loading = true;
  activeSection = 'personal';
  showAddressForm = false;
  mostrarFormularioCartao = false;
  selectedEndereco = null;

  // Formulários
  personalForm!: FormGroup;
  enderecoForm!: FormGroup;
  cartaoForm!: FormGroup;

  estados: Estado[] = [];
  cidades: Cidade[] = [];

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private estadoService: EstadoService,
    private cidadeService: CidadeService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadEstados();
  }

  /**
   * Carrega a lista de estados
   */
  private loadEstados(): void {
    this.estadoService.findAll().subscribe({
      next: (estados) => {
        this.estados = estados;
      },
      error: (error) => {
        console.error('Erro ao carregar estados:', error);
        this.showError('Erro ao carregar estados');
      },
    });
  }

  // Add this method to handle estado changes
  onEstadoChange(estadoId: string): void {
    if (!estadoId) {
      this.cidades = [];
      this.enderecoForm.get('cidade')?.setValue('');
      return;
    }

    this.cidadeService.findByEstado(parseInt(estadoId, 10)).subscribe({
      next: (cidades) => {
        this.cidades = cidades;
        this.enderecoForm.get('cidade')?.setValue('');
      },
      error: (error) => {
        console.error('Erro ao carregar cidades:', error);
        this.showError('Erro ao carregar cidades');
        this.cidades = [];
        this.enderecoForm.get('cidade')?.setValue('');
      },
    });
  }
  /**
   * Inicializa os formulários reativos
   */
  private initializeForms(): void {
    this.personalForm = this.fb.group({
      username: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: [''],
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required]],
        numero: ['', [Validators.required]],
      }),
    });

    this.enderecoForm = this.fb.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      cep: ['', [Validators.required]],
    });

    this.cartaoForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nomeTitular: ['', [Validators.required]],
      validade: ['', [Validators.required]],
      cvc: [
        '',
        [Validators.required, Validators.pattern(/^\d{3,4}$/)],
      ],
      cpf: ['', [Validators.required]],
      tipoCartao: ['', [Validators.required]], // 1 para crédito, 2 para débito
    });


  }



  private loadUserProfile(): void {
    this.loading = true;

    this.perfilService.getMeuPerfil().subscribe({
      next: (perfil) => {
        this.perfilUsuario = perfil;
        this.populatePersonalForm(perfil);
        this.loadAddresses();
        this.loadCards();
        console.log(this.perfilUsuario);
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.showError('Erro ao carregar dados do perfil');
        this.loading = false;
      },
    });
  }

  private loadAddresses(): void {
    this.perfilService.listEnderecosByUser().subscribe({
      next: (enderecos) => {
        this.enderecos = enderecos;
      },
      error: (error) => {
        console.error('Erro ao carregar endereços:', error);
        this.showError('Erro ao carregar endereços');
      },
    });
  }


  private loadCards(): void {
    this.perfilService.listCartoesByUser().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cartões:', error);
        this.showError('Erro ao carregar cartões');
        this.loading = false;
      },
    });
  }

  private populatePersonalForm(perfil: PerfilUsuario): void {
    this.personalForm.patchValue({
      username: perfil.username,
      email: perfil.email,
      cpf: perfil.cpf,
      dataNascimento: perfil.dataNascimento
        ? new Date(perfil.dataNascimento).toISOString().split('T')[0]
        : '',
      telefone: {
        codigoArea: perfil.telefone?.codigoArea || '',
        numero: perfil.telefone?.numero || '',
      },
    });
  }

  changeSection(section: string): void {
    this.activeSection = section;
  }

  onPersonalFormSubmit(): void {
    if (this.personalForm.valid && this.perfilUsuario) {
      const formData = this.personalForm.value;

      // Monte o objeto conforme o DTO espera
      const updateData = {
        email: formData.email,
        telefone: {
          codigoArea: formData.telefone.codigoArea,
          numero: formData.telefone.numero,
        },
        dataNascimento: formData.dataNascimento,
        cpf: formData.cpf,
      };

      console.log('Atualizando dados pessoais:', updateData);

      this.perfilService.atualizarDadosPessoais(updateData).subscribe({
        next: () => {
          this.showSuccess('Informações atualizadas com sucesso!');
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Erro ao atualizar informações:', error);
          this.showError('Erro ao atualizar informações pessoais');
        },
      });
    } else {
      this.showError('Por favor, preencha todos os campos obrigatórios');
    }
  }
  onAdressFormSubmit(): void {
    if (this.enderecoForm.valid) {
      const enderecoData: EnderecoRequestDTO = this.enderecoForm.value;

      console.log('Dados do endereço:', enderecoData);
      this.showSuccess('Endereço salvo com sucesso!');
      this.enderecoForm.reset();
      this.closeAddressForm();
    } else {
      this.showError('Por favor, preencha todos os campos obrigatórios');
    }
  }

  onCartaoFormSubmit(): void {
    if (this.cartaoForm.valid) {
      const formValue = this.cartaoForm.value;
      
      // Garantir que os tipos estão corretos
      const cartaoData: CartaoRequestDTO = {
        ...formValue,
        tipoCartao: Number(formValue.tipoCartao), // Converter para número
        cvc: Number(formValue.cvc) // Garantir que CVC é número
      };

      console.log('Dados do cartão:', cartaoData);
      this.perfilService.createCartao(cartaoData).subscribe({
        next: () => {
          this.showSuccess('Cartão salvo com sucesso!');
          this.loadCards();
          this.cartaoForm.reset();
          this.fecharFormularioCartao();
        },
        error: (error) => {
          console.error('Erro ao salvar cartão:', error);
          this.showError('Erro ao salvar cartão');
        }
      });
    } else {
      this.showError('Por favor, preencha todos os campos obrigatórios');
    }
  }

  /**
   * Handles avatar selection and upload
   */
  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.showError('Tipo de arquivo não suportado. Use PNG ou JPEG.');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.showError('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      this.uploadAvatar(file);
    }
  }

  /**
   * Upload da imagem de avatar
   */
  private uploadAvatar(file: File): void {
    const nomeImagem = `avatar_${Date.now()}.${file.type.split('/')[1]}`;

    this.perfilService.uploadImagemPerfil(file, nomeImagem).subscribe({
      next: () => {
        this.showSuccess('Foto de perfil atualizada com sucesso!');
        // Recarrega o perfil para obter a nova imagem
        this.loadUserProfile();
      },
      error: (error) => {
        console.error('Erro ao fazer upload da imagem:', error);
        this.showError('Erro ao atualizar foto de perfil');
      },
    });
  }

  public loadImageUrl(nomeImagem: string): string {
    return this.perfilService.getImageUrl(nomeImagem);
  }

  /**
   * Adiciona novo endereço
   */
  onEnderecoFormSubmit(): void {
    if (this.enderecoForm.valid) {
      const form = this.enderecoForm.value;
      const enderecoData = {
        ...form,
        estado: Number(form.estado),
        idCidade: Number(form.cidade),
      };

      console.log('Dados do endereço:', enderecoData);
      this.perfilService.createEndereco(enderecoData).subscribe({
        next: () => {
          this.showSuccess('Endereço salvo com sucesso!');
          this.loadAddresses();
          this.enderecoForm.reset();
          this.closeAddressForm();
        },
        error: (error) => {
          console.error('Erro ao salvar endereço:', error);
          this.showError('Erro ao salvar endereço');
        },
      });
    } else {
      this.showError(
        'Por favor, preencha todos os campos obrigatórios do endereço'
      );
    }
  }

  addAddress() {
    this.selectedEndereco = null;
    this.showAddressForm = true;
  }

  closeAddressForm() {
    this.showAddressForm = false;
    this.selectedEndereco = null;
  }

  /**
   * Remove endereço
   */
  deleteAddress(enderecoId: number): void {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.perfilService.deleteEndereco(enderecoId).subscribe({
        next: () => {
          this.showSuccess('Endereço removido com sucesso!');
          this.loadAddresses();
        },
        error: (error) => {
          console.error('Erro ao remover endereço:', error);
          this.showError('Erro ao remover endereço');
        },
      });
    }
  }

  /**
   * Adiciona novo cartão
   */
  addCard() {
    this.mostrarFormularioCartao = true;
  }
  abrirFormularioCartao() {
    this.mostrarFormularioCartao = true;
  }

  fecharFormularioCartao() {
    this.mostrarFormularioCartao = false;
  }
  /**
   * Remove cartão
   */
  deleteCard(cartaoId: number): void {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      this.perfilService.deleteCartao(cartaoId).subscribe({
        next: () => {
          this.showSuccess('Cartão removido com sucesso!');
          this.loadCards();
        },
        error: (error) => {
          console.error('Erro ao remover cartão:', error);
          this.showError('Erro ao remover cartão');
        },
      });
    }
  }

  /**
   * Formata o número do cartão para exibição
   */
  formatCardNumber(numero: string): string {
    // Mostra apenas os últimos 4 dígitos
    return `**** **** **** ${numero.slice(-4)}`;
  }

  /**
   * Retorna o ícone da bandeira do cartão (crédito ou débito)
   */
  getCardBrandIcon(tipoCartao: number): string {
    switch (tipoCartao) {
      case 1:
        return 'far fa-credit-card'; // ícone para crédito
      case 2:
        return 'fas fa-money-check-alt'; // ícone para débito
      default:
        return 'far fa-credit-card';
    }
  }

  /**
   * Exibe mensagem de sucesso
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Exibe mensagem de erro
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
