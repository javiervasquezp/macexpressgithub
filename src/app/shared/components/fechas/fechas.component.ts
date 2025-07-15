import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-fechas',
    imports: [CommonModule],
    templateUrl: './fechas.component.html',
    styleUrl: './fechas.component.css'
})
export class FechasComponent {
  
  @Input() isVisibleFechaActual = true;
  @Input() fechaconsulta: string = "";

  constructor() { }

  ngOnInit(): void {

  }
}
