import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToyType, ToyTypeEnum } from '../../models/toy.model';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected profileForm: FormGroup;
  protected passwordForm: FormGroup;
  protected favoriteTypes: ToyType[] = [];
  protected allTypes;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modal: ModalService,
    protected utils: Utils,
  ) {
    this.allTypes = this.utils.getToyTypeOptions();
    if (!AuthService.isLoggedIn()) {
      const returnTo = this.router.url;
      this.modal.openLogin(() => this.router.navigateByUrl(returnTo));
      this.router.navigateByUrl('/');
      this.profileForm = this.fb.group({});
      this.passwordForm = this.fb.group({});
      return;
    }

    const u: UserModel = AuthService.getActiveUser();
    this.favoriteTypes = [...u.favoriteTypes];

    this.profileForm = this.fb.group({
      firstName: [u.firstName, Validators.required],
      lastName: [u.lastName, Validators.required],
      email: [u.email, [Validators.required, Validators.email]],
      phone: [u.phone, Validators.required],
      address: [u.address, Validators.required],
    });

    this.passwordForm = this.fb.group({
      current: ['', Validators.required],
      next: ['', Validators.required],
      repeat: ['', Validators.required],
    });
  }

  protected toggleType(t: ToyType): void {
    const i = this.favoriteTypes.indexOf(t);
    if (i > -1) this.favoriteTypes.splice(i, 1);
    else this.favoriteTypes.push(t);
  }

  protected saveProfile(): void {
    if (!this.profileForm.valid) {
      this.utils.error('Neispravni podaci profila.');
      return;
    }
    this.utils.confirm('Sačuvati izmene profila?', () => {
      AuthService.updateProfile({ ...this.profileForm.value, favoriteTypes: this.favoriteTypes });
      this.utils.toast('Podaci su sačuvani.');
    });
  }

  protected savePassword(): void {
    if (!this.passwordForm.valid) {
      this.utils.error('Popunite sva polja za lozinku.');
      return;
    }
    const { current, next, repeat } = this.passwordForm.value;
    if (next !== repeat) {
      this.utils.error('Nove lozinke se ne poklapaju.');
      return;
    }
    try {
      AuthService.updatePassword(current, next);
      this.utils.toast('Lozinka je promenjena.');
      this.passwordForm.reset();
    } catch {
      this.utils.error('Pogrešna trenutna lozinka.');
    }
  }
}
