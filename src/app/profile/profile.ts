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
    this.allTypes = utils.toyTypeOptions;
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
      console.error('Neispravni podaci profila.');  // TODO: fix this
      return;
    }
    this.utils.confirm('Sačuvati izmene profila?', () => {
      AuthService.updateProfile({ ...this.profileForm.value, favoriteTypes: this.favoriteTypes });
      console.log('Podaci su sačuvani.'); // TODO: fix this
    });
  }

  protected savePassword(): void {
    if (!this.passwordForm.valid) {
      console.error('Popunite sva polja za lozinku.'); // TODO: fix this
      return;
    }
    const { current, next, repeat } = this.passwordForm.value;
    if (next !== repeat) {
      console.error('Nove lozinke se ne poklapaju.'); // TODO: fix this
      return;
    }
    try {
      AuthService.updatePassword(current, next);
      console.log('Lozinka je promenjena.'); // TODO: fix this
      this.passwordForm.reset();
    } catch {
      console.error('Pogrešna trenutna lozinka.'); // TODO: fix this
    }
  }
}
