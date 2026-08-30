import { ToyModel } from './toy.model';

export type ReservationStatus = 'rezervisano' | 'pristiglo' | 'otkazano';

export interface ReservationModel {
  id: number;
  toyId: number;
  toy: ToyModel; // local copy -
  status: ReservationStatus;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string | null;
}
