import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaoListComponent } from './cartao-list.component';

describe('CartaoListComponent', () => {
  let component: CartaoListComponent;
  let fixture: ComponentFixture<CartaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
