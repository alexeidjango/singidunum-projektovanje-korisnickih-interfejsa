import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Utils } from './utils';
import { ModalService } from '../services/modal.service';
import { LoginModal } from './login-modal/login-modal';
import { RegisterModal } from './register-modal/register-modal';
import { CartService } from '../services/cart.service';

@Component({
  imports: [RouterOutlet, RouterLink, LoginModal, RegisterModal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor(
    protected router: Router,
    protected utils: Utils,
    protected modal: ModalService,
  ) {}
  protected isLoggedIn(): boolean {
    return AuthService.isLoggedIn();
  }

  protected username(): string {
    return AuthService.isLoggedIn() ? AuthService.getActiveUser().username : '';
  }

  protected readonly cartCount = CartService.count;

  protected logout(): void {
    this.utils.confirm('Odjaviti se?', () => {
      AuthService.logout();
      this.router.navigateByUrl('/');
    });
  }
}
