import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

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
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected submit(): void {
    if (!this.form.valid) {
      console.log('Popunite sva polja.'); // TODO: fix, add normal alert
      return;
    }
    try {
      AuthService.login(this.form.value.username, this.form.value.password);
      this.modal.resolve();
    } catch {
      console.log('Pogrešni podaci za prijavu.'); // TODO: fix, add normal alert
    }
  }
}
