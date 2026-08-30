import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToyModel, ToyModelWithReservation } from '../../models/toy.model';
import { AuthService } from '../../services/auth.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';
import { ToyQuery, ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  protected all = signal<ToyModel[]>([]);
  protected filteredOut = signal<ToyModelWithReservation[]>([]);

  // filter fields, bound with [(ngModel)] in the template
  protected fText = '';
  protected fName = '';
  protected fDescription = '';
  protected fType = 'all';
  protected fAgeGroup = 'all';
  protected fTargetGroup = 'all';
  protected fDateFrom = '';
  protected fDateTo = '';
  protected fPriceFrom: number | null = null;
  protected fPriceTo: number | null = null;
  protected fMinRating: number | null = null;
  protected sortBy: 'new' | 'price-asc' | 'price-desc' | 'rating' = 'new';

  constructor(
    private router: Router,
    private modal: ModalService,
    protected utils: Utils,
  ) {}

  async ngOnInit() {
    await ToyService.fetchToys().then(() => {
      this.all.set(ToyService.getToys());
      this.apply();
    });
  }
  protected apply(): void {
    const query: ToyQuery = {
      text: this.fText,
      type: this.fType,
      ageGroup: this.fAgeGroup,
      targetGroup: this.fTargetGroup,
      dateFrom: this.fDateFrom,
      dateTo: this.fDateTo,
      priceFrom: this.fPriceFrom,
      priceTo: this.fPriceTo,
      minRating: this.fMinRating,
    };
    const reservedToys = AuthService.getActiveUser().reservations.map(
      (reservation) => reservation.toyId,
    );
    const filteredOut: ToyModelWithReservation[] = this.sortList(ToyService.search(query)).map(
      (toy: ToyModelWithReservation) => ({
        ...toy,
        isAlreadyReserved: reservedToys.includes(toy.id),
      }),
    );

    this.filteredOut.set(filteredOut);
  }

  protected reset(): void {
    this.fText = this.fName = this.fDescription = '';
    this.fType = this.fAgeGroup = this.fTargetGroup = 'all';
    this.fDateFrom = this.fDateTo = '';
    this.fPriceFrom = this.fPriceTo = this.fMinRating = null;
    this.sortBy = 'new';
    this.apply();
  }

  private sortList(list: ToyModel[]): ToyModel[] {
    const copy = [...list];
    switch (this.sortBy) {
      case 'price-asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'rating':
        return copy.sort((a, b) => ToyService.averageRating(b) - ToyService.averageRating(a));
      default:
        return copy.sort((a, b) => b.id - a.id); // newest first
    }
  }

  protected reserve(toy: ToyModel): void {
    if (!AuthService.isLoggedIn()) {
      this.modal.openLogin(() => this.router.navigate(['/rezervacija', toy.id]));
      return;
    }
    this.router.navigate(['/rezervacija', toy.id]);
  }

  protected avg(toy: ToyModel): number {
    return ToyService.averageRating(toy);
  }
  protected count(toy: ToyModel): number {
    return ToyService.ratingCount(toy);
  }

  protected ageGroups(): string[] {
    return [...new Set(this.all().map((t) => t.ageGroup))].sort();
  }
}
