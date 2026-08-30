import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationModel } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-rate-toy',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './rate-toy.html',
  styleUrl: './rate-toy.css',
})
export class RateToy {
  protected form: FormGroup;
  protected reservation = signal<ReservationModel | null>(null);
  protected stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private utils: Utils,
  ) {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: [''],
    });

    if (!AuthService.isLoggedIn()) {
      const returnTo = this.router.url;
      this.modal.openLogin(() => this.router.navigateByUrl(returnTo));
      this.router.navigateByUrl('/');
      return;
    }

    this.route.params.subscribe((params: any) => {
      let r: ReservationModel;
      try {
        r = CartService.get(params.id);
      } catch {
        this.router.navigateByUrl('/korpa');
        return;
      }
      if (r.status !== 'pristiglo' || r.reviewed) {
        console.error('Ovu igračku nije moguće oceniti.'); // TODO: Fix this!
        this.router.navigateByUrl('/korpa');
        return;
      }
      this.reservation.set(r);
    });
  }

  protected setRating(n: number): void {
    this.form.patchValue({ rating: n });
  }

  protected submit(): void {
    if (!this.form.valid) {
      console.error('Izaberite ocenu (1–5 zvezdica).'); // TODO: Fix this!
      return;
    }
    const user = AuthService.getActiveUser();
    CartService.review(this.reservation()!.id, {
      author: `${user.firstName} ${user.lastName.charAt(0)}.`,
      rating: this.form.value.rating,
      comment: this.form.value.comment ?? '',
      createdAt: new Date().toISOString(),
    });
    console.log('Hvala na oceni.'); // TODO: Fix this!
    this.router.navigateByUrl('/korpa');
  }
}
