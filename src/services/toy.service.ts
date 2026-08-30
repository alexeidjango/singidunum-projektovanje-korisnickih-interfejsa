import { ToyModel, ReviewModel } from '../models/toy.model';
import axios from 'axios';

export interface ToyQuery {
  text?: string;
  type?: string;
  ageGroup?: string;
  targetGroup?: string;
  dateFrom?: string;
  dateTo?: string;
  priceFrom?: number | null;
  priceTo?: number | null;
  minRating?: number | null;
}

export class ToyService {
  private static LOCAL_STORAGE_KEY = 'ls_toys';

  static async fetchToys() {
    const toys = JSON.parse(localStorage.getItem(ToyService.LOCAL_STORAGE_KEY) || '[]');
    if (toys && toys.length > 0) {
      return;
    }
    try {
      await axios.get('/toys.json').then((response) => {
        localStorage.setItem(ToyService.LOCAL_STORAGE_KEY, JSON.stringify(response.data));
      });
    } catch (error) {
      console.error(error);
      localStorage.setItem(ToyService.LOCAL_STORAGE_KEY, '[]');
    }
  }

  static getToys(): ToyModel[] {
    const toys = JSON.parse(localStorage.getItem(ToyService.LOCAL_STORAGE_KEY) || '[]');
    return toys as ToyModel[];
  }

  private static save(toys: ToyModel[]): void {
    localStorage.setItem(ToyService.LOCAL_STORAGE_KEY, JSON.stringify(toys));
  }

  static getToyById(id: number): ToyModel {
    const toy = ToyService.getToys().find((t) => t.id === Number(id));
    if (!toy) throw new Error('TOY_NOT_FOUND');
    return toy;
  }

  static addReview(toyId: number, review: ReviewModel): void {
    const toys = ToyService.getToys();
    toys.forEach((t) => {
      if (t.id === Number(toyId)) t.reviews.push(review);
    });
    ToyService.save(toys);
  }

  static averageRating(toy: ToyModel): number {
    if (toy.reviews.length === 0) return 0;
    const sum = toy.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / toy.reviews.length;
  }

  static ratingCount(toy: ToyModel): number {
    return toy.reviews.length;
  }

  static search(q: ToyQuery): ToyModel[] {
    const normalizedSearchText = (q.text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
      ToyService.getToys()
        .filter(
          (t) =>
            !q.text ||
            (t.name + ' ' + t.description)
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .includes(normalizedSearchText),
        ) // AM: Not proud of this solution, technically if it was a production project I would invest
        // more time into cyrillic <=> latin search and proper collation resolution, but I've already
        // spent like half an hour on this...
        .filter((t) => !q.type || q.type === 'all' || t.type === q.type)
        .filter((t) => !q.ageGroup || q.ageGroup === 'all' || t.ageGroup === q.ageGroup)
        .filter((t) => !q.targetGroup || q.targetGroup === 'all' || t.targetGroup === q.targetGroup)
        .filter((t) => !q.dateFrom || t.productionDate >= q.dateFrom)
        .filter((t) => !q.dateTo || t.productionDate <= q.dateTo)
        .filter((t) => q.priceFrom == null || t.price >= q.priceFrom)
        .filter((t) => q.priceTo == null || t.price <= q.priceTo)
        .filter((t) => q.minRating == null || ToyService.averageRating(t) >= q.minRating)
    );
  }
}
