import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoPedidoComponent } from './confirmacao-pedido.component';

describe('ConfirmacaoPedidoComponent', () => {
  let component: ConfirmacaoPedidoComponent;
  let fixture: ComponentFixture<ConfirmacaoPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacaoPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacaoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
