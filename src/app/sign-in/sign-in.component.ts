import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  signInForm!: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService) { }


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signInForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.value;

    this.userService.getTokenBySignIn(email, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
      },
      error: (err: any) => {

      }
    })

  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onForgotPasswordClicked() {

  }
}
