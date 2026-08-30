import { UserModel } from '../models/user.model';
import { ToyTypeEnum } from '../models/toy.model';

const DEFAULT_USER: UserModel = {
  firstName: 'Aleksej',
  lastName: 'Melnikov',
  email: 'melnikov@gmail.com',
  phone: '+381637731799',
  address: 'Svetogorska 25, Beograd - Stari Grad',
  favoriteTypes: [ToyTypeEnum.SLAGALICA, ToyTypeEnum.DRUSTVENA_IGRA],
  username: 'alexei',
  password: '2023203407',
  // reservations: [],
};

export class AuthService {
  static LOCAL_USERS_KEY = 'ls_users';
  static LOCAL_ACTIVE_USER_KEY = 'ls_active_user';

  static getUsers(): UserModel[] {
    if (!localStorage.getItem(AuthService.LOCAL_USERS_KEY)) {
      localStorage.setItem(AuthService.LOCAL_USERS_KEY, JSON.stringify([DEFAULT_USER]));
    }
    return JSON.parse(localStorage.getItem(AuthService.LOCAL_USERS_KEY)!);
  }

  static saveUsers(users: UserModel[]): void {
    localStorage.setItem(AuthService.LOCAL_USERS_KEY, JSON.stringify(users));
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem(AuthService.LOCAL_ACTIVE_USER_KEY);
  }
  static findByUsername(username: string): UserModel {
    const user = AuthService.getUsers().find((u) => u.username === username);
    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  static getActiveUser(): UserModel {
    const username = localStorage.getItem(AuthService.LOCAL_ACTIVE_USER_KEY);
    if (!username) throw new Error('NO_ACTIVE_USER');
    return AuthService.findByUsername(username);
  }

  static login(username: string, password: string): void {
    const user = AuthService.findByUsername(username);
    if (user.password !== password) throw new Error('BAD_CREDENTIALS');
    localStorage.setItem(AuthService.LOCAL_ACTIVE_USER_KEY, user.username);
  }

  static register(payload: UserModel): void {
    const users = AuthService.getUsers();
    if (users.some((u) => u.username === payload.username)) {
      throw new Error('USERNAME_ALREADY_TAKEN');
    }
    users.push({ ...payload /*, reservations: []*/ });
    AuthService.saveUsers(users);
    localStorage.setItem(AuthService.LOCAL_ACTIVE_USER_KEY, payload.username); // auto-login
  }

  static logout(): void {
    localStorage.removeItem(AuthService.LOCAL_ACTIVE_USER_KEY);
  }

  static updateProfile(patch: Partial<UserModel>): void {
    const active = AuthService.getActiveUser();
    const users = AuthService.getUsers();
    users.forEach((u) => {
      if (u.username === active.username) {
        Object.assign(u, {
          ...patch,
          username: u.username,
          password: u.password,
          // reservations: u.reservations,
        });
      }
    });
    AuthService.saveUsers(users);
  }

  static updatePassword(oldPassword: string, newPassword: string): void {
    const active = AuthService.getActiveUser();
    if (active.password !== oldPassword) throw new Error('BAD_PASSWORD');
    const users = AuthService.getUsers();
    users.forEach((u) => {
      if (u.username === active.username) u.password = newPassword;
    });
    AuthService.saveUsers(users);
  }
}
