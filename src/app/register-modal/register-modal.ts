import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToyType } from '../../models/toy.model';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Utils } from '../utils';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-register-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css',
})
export class RegisterModal {
  protected form: FormGroup;
  protected favoriteTypes: ToyType[] = [];

  protected allTypes;

  constructor(
    private fb: FormBuilder,
    protected modal: ModalService,
    private utils: Utils,
  ) {
    this.allTypes = this.utils.getToyTypeOptions();
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
    });
  }

  protected toggleType(t: ToyType): void {
    const i = this.favoriteTypes.indexOf(t);
    if (i > -1) this.favoriteTypes.splice(i, 1);
    else this.favoriteTypes.push(t);
  }

  protected submit(): void {
    if (!this.form.valid) {
      this.utils.error('Popunite sva obavezna polja ispravno.');
      return;
    }
    if (this.form.value.password !== this.form.value.repeat) {
      this.utils.error('Lozinke se ne poklapaju.');
      return;
    }
    const v = this.form.value;
    const user: UserModel = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      address: v.address,
      favoriteTypes: this.favoriteTypes,
      username: v.username,
      password: v.password,
      reservations: [],
    };
    try {
      AuthService.register(user);
      this.utils.toast('Nalog je kreiran.');
      this.modal.resolve();
    } catch {
      this.utils.error('Korisničko ime je zauzeto.');
    }
  }
}
