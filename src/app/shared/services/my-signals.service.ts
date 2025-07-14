import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MySignalsService {

  private mostrarMenuMovil = signal<boolean> (false); 

  constructor() { }

  public getMostrarMenuMovil() : boolean {
    return this.mostrarMenuMovil();
  }

  public updateMostrarMenuMovil(value: boolean) {
    this.mostrarMenuMovil.set(value);
  }
  
}
