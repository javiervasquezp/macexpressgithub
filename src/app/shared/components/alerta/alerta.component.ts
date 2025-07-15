import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-alerta',
    imports: [],
    templateUrl: './alerta.component.html',
    styleUrl: './alerta.component.css'
})
export class AlertaComponent {
  @Input() msg = "";
}
