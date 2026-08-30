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
      console.error('Popunite sva obavezna polja ispravno.');
      return;
    }
    if (this.form.value.password !== this.form.value.repeat) {
      console.error('Lozinke se ne poklapaju.');
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
      // reservations: [],    // TODO: fix this!
    };
    try {
      AuthService.register(user);
      console.log('Nalog je kreiran.'); // TODO: fix this!
      this.modal.resolve();
    } catch {
      console.log('Korisničko ime je zauzeto.');  // TODO: fix this!
    }
  }
}
