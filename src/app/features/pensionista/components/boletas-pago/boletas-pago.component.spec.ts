import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletasPagoComponent } from './boletas-pago.component';

describe('BoletasPagoComponent', () => {
  let component: BoletasPagoComponent;
  let fixture: ComponentFixture<BoletasPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletasPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoletasPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
