import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

type UserFields = 'name' | 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup;
  formErrors: FormErrors = {
    'name': '',
    'email': '',
    'password': '',
  }
  validationMessages = {
    'name': {
      'required': 'Name is required',
      'minlength': 'Name must be at least 3 characters long'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email must be valid'
    },
    'password': {
      'required': 'Password is required',
      'pattern': 'Password must contain at least one letter and one number. ',
      'minlength': 'Password must be at least 8 characters long. ',
      'maxlength': 'Password cannot be more than 40 characters long. '
    }
  }

  constructor(
    private fb: FormBuilder,
    private _authS: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this._authS.user) {
      this.router.navigate(['/dashboard']);
    }
  }

  buildForm() {
    this.userForm = this.fb.group({
      'name': ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(40),
        Validators.required
      ]]
    });
    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }

    const form = this.userForm;

    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]}`;
              }
            }
          }
        }
      }
    }
  }

  signUp() {
    this._authS.emailSignup(
      this.userForm.value['name'],
      this.userForm.value['email'],
      this.userForm.value['password']
    ).then(
      user => this.router.navigate(['/dashboard'])
    );
  }

}
