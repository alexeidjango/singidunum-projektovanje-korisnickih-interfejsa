import { ToyType } from './toy.model';
import { ReservationModel } from './reservation.model';

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  favoriteTypes: ToyType[];
  username: string;
  password: string;
  reservations: ReservationModel[];
}
