import { computed, inject, Injectable, signal } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';
import { DetalleMenuModel, MenuModel, MenuPrincipalModel } from '@core/models/menu.models';
import { MenuService } from 'app/auth/services/menu.service';
import { catchError, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStoreService {

  // estado: array de MenuPrincipalModel
  private readonly _menus = signal<MenuPrincipalModel[]>([]);

  // flags
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Exponer solo-lectura
  readonly menus = this._menus.asReadonly();

  // computed: primer menú (ejemplo), puedes crear otros computed según necesidad
  readonly firstMenu = computed(() => {
    const arr = this._menus();
    return arr && arr.length ? arr[0] : null;
  });

  private readonly menuSvc = inject(MenuService);
  constructor() { }

  //UTIL: copia profunda para que la señal vea un nuevo objeto 
  //deep copy (usa structuredClone o JSON fallback)
  private deepCopy<T>(obj: T): T {
    const sc = (globalThis as any).structuredClone;
    return sc ? sc(obj) : JSON.parse(JSON.stringify(obj));
  }

  //Cargar menú desde backend (llamar después del login)
  loadMenu(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.menuSvc.ListaMenu()
      .pipe(
        take(1),
        tap((res: any) => {
          console.log("this.menuSvc.ListaMenu()");
          console.log(res);
          if (res.Codigo == CoreConstants.CodigoRespuesta.OperacionExitosa &&
            res.Result && Array.isArray(res.Result)) {
            // aquí mapea la estructura que venga del backend a tu modelo si hace falta
            const menus = res.Result as MenuPrincipalModel[];

            menus.forEach((menu: MenuPrincipalModel, idxA: number) => {
              menu.ListaMenu.forEach((menuModel: MenuModel, idxB: number) => {
                menuModel.Detalle?.forEach((detalle: DetalleMenuModel, idxC: number) => {
                  detalle.Seleccionado = (idxA == 0 && idxB == 0 && idxC == 0)
                });
              });
            });

            this._menus.set(this.deepCopy(menus));
          }
          else {
            // si la respuesta tiene otra forma
            this._menus.set([]);
          }
          this.isLoading.set(false);
        }),
        catchError(err => {
          console.error('MenuStore.loadMenus error', err);
          this.error.set('No se pudo cargar el menú');
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  // Obtener un computed readonly para un menú por Id (útil en componentes)
  menuById(id: string) {
    return computed(() => {
      const found = this._menus().find(m => m.Id === id);
      return found ? this.deepCopy(found) : null;
    });
  }

  // Operaciones sobre ListaMenu de un MenuPrincipal (ej: toggle seleccionado)
  toggleSeleccionDetalle(menuId: string, idServicio: number): void {
    const current = this.deepCopy(this._menus());
    const updated = current.map(menu => {
      if (menu.Id !== menuId) return menu;
      menu.ListaMenu = (menu.ListaMenu ?? []).map(item => {
        if (!item.Detalle) return item;
        item.Detalle = item.Detalle.map(det => det && det.IdServicio === idServicio ? { ...det, Seleccionado: !det.Seleccionado } : det);
        return item;
      });
      return menu;
    });
    this._menus.set(updated);
  }

  // Actualizar un Detalle por Id (busca en todo el array)
  updateDetalleGlobalById(idServicio: number, patch: Partial<DetalleMenuModel>): void {
    const current = this.deepCopy(this._menus());
    const updated = current.map(menu => {
      menu.ListaMenu = (menu.ListaMenu ?? []).map(item => {
        if (!item.Detalle) return item;
        item.Detalle = item.Detalle.map(det => det && det.IdServicio === idServicio ? { ...det, ...patch } : det);
        return item;
      });
      return menu;
    });
    this._menus.set(updated);
  }
}
