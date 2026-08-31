import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {
  protected form: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected modal: ModalService,
    protected utils: Utils,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected submit(): void {
    if (!this.form.valid) {
      this.utils.error('Popunite sva polja.');
      return;
    }
    try {
      AuthService.login(this.form.value.username, this.form.value.password);
      this.modal.resolve();
    } catch {
      this.utils.error('Pogrešni podaci za prijavu.');
    }
  }
}
