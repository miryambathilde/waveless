import { Routes } from '@angular/router';
import { MainLayout } from '@layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
      },
      {
        path: 'destinos',
        loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
      },
      {
        path: 'alojamiento',
        loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
      },
      {
        path: 'sobre-nosotros',
        loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
      },
    ],
  },
];
