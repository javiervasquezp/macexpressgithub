import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAportesAcreditadosComponent } from './reporte-aportes-acreditados.component';

describe('ReporteAportesAcreditadosComponent', () => {
  let component: ReporteAportesAcreditadosComponent;
  let fixture: ComponentFixture<ReporteAportesAcreditadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAportesAcreditadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteAportesAcreditadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
