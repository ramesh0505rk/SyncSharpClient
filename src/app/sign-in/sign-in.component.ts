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

  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService) { }


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signInForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z][a-zA-Z0-9_.-]*$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    this.isLoading = true;
    if (this.signInForm.invalid) {
      this.isLoading = false;
      this.signInForm.markAllAsTouched();
      return;
    }

    const { userName, password } = this.signInForm.value;

    this.userService.getTokenBySignIn(userName, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        this.authService.checkAuthStatus();
        this.router.navigate(['/home']);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    })

  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onForgotPasswordClicked() {

  }
}
