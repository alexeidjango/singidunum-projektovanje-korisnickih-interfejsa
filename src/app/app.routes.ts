import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';

export const routes: Routes = [
  { path: '', title: 'Katalog igračaka', component: Catalog },
  { path: '**', redirectTo: '' },
];
