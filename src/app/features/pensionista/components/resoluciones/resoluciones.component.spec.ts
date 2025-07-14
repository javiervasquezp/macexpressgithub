import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolucionesComponent } from './resoluciones.component';

describe('ResolucionesComponent', () => {
  let component: ResolucionesComponent;
  let fixture: ComponentFixture<ResolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolucionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
