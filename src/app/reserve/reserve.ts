import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-reserve',
  imports: [RouterLink],
  templateUrl: './reserve.html',
  styleUrl: './reserve.css',
})
export class Reserve {
  protected toy = signal<ToyModel | null>(null);

  constructor(
    private route: ActivatedRoute,
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

    this.route.params.subscribe((params: any) => {
      try {
        this.toy.set(ToyService.getToyById(params.id));
      } catch {
        this.router.navigateByUrl('/');
      }
    });
  }

  protected confirm(): void {
    const toy = this.toy()!;
    this.utils.confirm('Potvrditi rezervaciju?', () => {
      CartService.add(toy);
      this.utils.toast(`Igračka „${toy.name}" je rezervisana.`);
      this.router.navigateByUrl('/korpa');
    });
  }
}
