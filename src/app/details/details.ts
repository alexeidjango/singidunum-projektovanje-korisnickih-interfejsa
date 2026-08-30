import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { AuthService } from '../../services/auth.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  protected toy = signal<ToyModel | null>(null);
  protected reviewableReservationId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    protected utils: Utils,
  ) {
    this.route.params.subscribe((params: any) => {
      try {
        const toy = ToyService.getToyById(params.id);
        this.toy.set(toy);
        this.computeReviewable(toy.id);
      } catch {
        console.error('toy not found');
        this.router.navigateByUrl('/'); // bad id → go home
      }
    });
  }

  private computeReviewable(toyId: number): void {
    this.reviewableReservationId = null;
    if (!AuthService.isLoggedIn()) return;
    const match = CartService.list().find(
      (r) => r.toyId === toyId && r.status === 'pristiglo' && !r.reviewed,
    );
    this.reviewableReservationId = match ? match.id : null;
  }

  protected reserve(): void {
    const id = this.toy()!.id;
    if (!AuthService.isLoggedIn()) {
      this.modal.openLogin(() => this.router.navigate(['/rezervacija', id]));
      return;
    }
    this.router.navigate(['/rezervacija', id]);
  }

  protected avg(): number {
    return ToyService.averageRating(this.toy()!);
  }
  protected count(): number {
    return ToyService.ratingCount(this.toy()!);
  }
}
