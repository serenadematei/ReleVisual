import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'cosasLindas',
    loadComponent: () => import('./cosas-lindas/cosas-lindas.page').then( m => m.CosasLindasPage)
  },
  {
    path: 'cosasFeas',
    loadComponent: () => import('./cosas-feas/cosas-feas.page').then( m => m.CosasFeasPage)
  },
  {
    path: 'listadoFotos',
    loadComponent: () => import('./listado-fotos/listado-fotos.page').then( m => m.ListadoFotosPage)
  },  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'resultados',
    loadComponent: () => import('./resultados/resultados.page').then( m => m.ResultadosPage)
  },



];
