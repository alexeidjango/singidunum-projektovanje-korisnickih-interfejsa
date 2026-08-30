import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationModel } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit-reservation',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-reservation.html',
  styleUrl: './edit-reservation.css',
})
export class EditReservation {
  protected form: FormGroup | null = null;
  protected reservation = signal<ReservationModel | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private utils: Utils,
  ) {
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
      if (r.status !== 'rezervisano') {
        console.error('Moguća je izmena samo rezervisanih stavki.'); // TODO: Fix this
        this.router.navigateByUrl('/korpa');
        return;
      }
      this.reservation.set(r);
      this.form = this.fb.group({
        name: [r.toy.name, Validators.required],
        description: [r.toy.description, Validators.required],
        type: [r.toy.type, Validators.required],
        ageGroup: [r.toy.ageGroup, Validators.required],
        targetGroup: [r.toy.targetGroup, Validators.required],
        productionDate: [r.toy.productionDate, Validators.required],
        price: [r.toy.price, [Validators.required, Validators.min(0)]],
      });
    });
  }

  protected save(): void {
    if (!this.form || !this.form.valid) {
      console.error('Neispravni podaci.'); // TODO: Fix this
      return;
    }
    CartService.updateToy(this.reservation()!.id, this.form.value);
    console.log('Izmene su sačuvane.'); // TODO: fix this
    this.router.navigateByUrl('/korpa');
  }
}
