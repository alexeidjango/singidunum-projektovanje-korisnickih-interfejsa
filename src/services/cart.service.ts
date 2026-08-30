import { AuthService } from './auth.service';
import { ToyService } from './toy.service';
import { ToyModel, ReviewModel } from '../models/toy.model';
import { ReservationModel, ReservationStatus } from '../models/reservation.model';

export class CartService {
  static list(): ReservationModel[] {
    return AuthService.getActiveUser().reservations;
  }

  private static mutate(change: (reservations: ReservationModel[]) => void): void {
    const active = AuthService.getActiveUser();
    const users = AuthService.getUsers();
    users.forEach((u) => {
      if (u.username === active.username) change(u.reservations);
    });
    AuthService.saveUsers(users);
  }

  static add(toy: ToyModel): void {
    this.mutate((reservations) => {
      reservations.push({
        id: Date.now(), // simple unique id
        toyId: toy.id,
        toy: JSON.parse(JSON.stringify(toy)), // deep copy — see note below
        status: 'rezervisano',
        reviewed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      });
    });
  }

  static get(id: number): ReservationModel {
    const r = this.list().find((x) => x.id === Number(id));
    if (!r) throw new Error('RESERVATION_NOT_FOUND');
    return r;
  }

  static isAlreadyReservedForActiveUser(toyId: number): boolean {
    try {
      const existingToy = this.list().find((x) => x.toyId == toyId);
      return !!existingToy;
    } catch (e) {
      return false;
    }
  }

  static updateToy(id: number, patch: Partial<ToyModel>): void {
    this.mutate((reservations) => {
      reservations.forEach((r) => {
        if (r.id === Number(id) && r.status === 'rezervisano') {
          Object.assign(r.toy, patch);
          r.updatedAt = new Date().toISOString();
        }
      });
    });
  }

  static setStatus(id: number, status: ReservationStatus): void {
    this.mutate((reservations) => {
      reservations.forEach((r) => {
        if (r.id === Number(id)) {
          r.status = status;
          r.updatedAt = new Date().toISOString();
        }
      });
    });
  }

  static remove(id: number): void {
    console.log('Removing', id);
    this.mutate((reservations) => {
      const i = reservations.findIndex((r) => r.id === Number(id));
      if (i > -1) {
        reservations.splice(i, 1);
      }
    });
  }

  static review(id: number, review: ReviewModel): void {
    const r = this.get(id);
    if (r.status !== 'pristiglo') throw new Error('NOT_ARRIVED');
    ToyService.addReview(r.toyId, review);
    this.mutate((reservations) => {
      reservations.forEach((x) => {
        if (x.id === Number(id)) x.reviewed = true;
      });
    });
  }

  static total(): number {
    return this.list()
      .filter((r) => r.status !== 'otkazano')
      .reduce((sum, r) => sum + r.toy.price, 0);
  }
}
