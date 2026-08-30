import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReservationModel } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected rows = signal<ReservationModel[]>([]);

  constructor(
    private router: Router,
    private modal: ModalService,
    protected utils: Utils,
  ) {
    if (!AuthService.isLoggedIn()) {
      const returnTo = this.router.url;
      this.modal.openLogin(() => this.router.navigateByUrl(returnTo));
      this.router.navigateByUrl('/');
      return;
    }
    this.load();
  }

  private load(): void {
    this.rows.set(CartService.list());
  }

  protected total(): number {
    return CartService.total();
  }

  protected edit(r: ReservationModel): void {
    this.router.navigate(['/korpa/izmena', r.id]);
  }

  protected rate(r: ReservationModel): void {
    this.router.navigate(['/korpa/ocena', r.id]);
  }

  protected remove(r: ReservationModel): void {
    this.utils.confirm(`Ukloniti „${r.toy.name}" iz korpe?`, () => {
      CartService.remove(r.id);
      this.load();
    });
  }

  /** Dev helper: pretend the toy arrived. */
  protected deliver(r: ReservationModel): void {
    CartService.setStatus(r.id, 'pristiglo');
    this.load();
  }
}
