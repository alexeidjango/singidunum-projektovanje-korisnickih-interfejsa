import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';
import { Details } from './details/details';
import { Reserve } from './reserve/reserve';
import { RateToy } from './rate-toy/rate-toy';
import { Cart } from './cart/cart';
import { EditReservation } from './edit-reservation/edit-reservation';

export const routes: Routes = [
  { path: '', title: 'Katalog igračaka', component: Catalog },
  { path: 'profil', title: 'Moj profil', component: Profile },
  { path: 'igracka/:id', title: 'Detalji igračke', component: Details },
  { path: 'rezervacija/:id', title: 'Rezervacija', component: Reserve },
  { path: 'korpa', title: 'Korpa rezervacija', component: Cart },
  { path: 'korpa/izmena/:id', title: 'Izmena rezervacije', component: EditReservation },
  { path: 'korpa/ocena/:id', title: 'Ocena igračke', component: RateToy },
  { path: '**', redirectTo: '' },
];
