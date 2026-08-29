import { ToyType, ToyTypeEnum } from './toy.model';

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  favoriteTypes: ToyTypeEnum[];
  username: string;
  password: string;
  // reservations: // TODO: ADD this
}
