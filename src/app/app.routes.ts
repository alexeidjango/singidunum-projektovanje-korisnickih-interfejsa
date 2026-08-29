import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', title: 'Katalog igračaka', component: Catalog },
  { path: 'profil', title: 'Moj profil', component: Profile },
  { path: '**', redirectTo: '' },
];
