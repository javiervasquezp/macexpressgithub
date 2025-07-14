import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit{
  @Input() mostrarImprimir: boolean = false;
  @Input() nombreCompleto :string ='';
  @Input() numeroDocumento : string ='';
  @Input() tipoDocumento : string ='';
  @Output() printHandler = new EventEmitter();
  userService = inject(UserService);

  ngOnInit(): void {
  }
  
  onClickHandler(): void {
		this.printHandler.emit();
	}
}
