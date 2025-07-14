import { Injectable, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  ngxSpinnerSvc = inject(NgxSpinnerService);

  constructor() { }

  public hide(){
    this.ngxSpinnerSvc.hide();
  }

  public show(){
    this.ngxSpinnerSvc.show();
  }
}
