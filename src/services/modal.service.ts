import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly login = signal(false);
  readonly register = signal(false);

  private afterAuth: (() => void) | null = null;

  openLogin(then?: () => void): void {
    this.afterAuth = then ?? null;
    this.register.set(false);
    this.login.set(true);
  }

  openRegister(then?: () => void): void {
    this.afterAuth = then ?? null;
    this.login.set(false);
    this.register.set(true);
  }

  close(): void {
    this.login.set(false);
    this.register.set(false);
  }

  resolve(): void {
    const callback = this.afterAuth;
    this.afterAuth = null;
    this.close();
    callback?.();
  }
}
