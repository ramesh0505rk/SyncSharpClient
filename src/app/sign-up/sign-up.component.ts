import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnDestroy {
  signUpForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isCheckingUserName: boolean = false;
  userNameTaken: boolean = false;
  private userNameSub?: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.listenToUserNameChanges();
  }

  ngOnDestroy(): void {
    this.userNameSub?.unsubscribe();
  }

  initializeForm() {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z][a-zA-Z0-9_.-]*$')]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  listenToUserNameChanges() {
    this.userNameSub = this.signUpForm.get('userName')!.valueChanges.pipe(
      tap(val=> { this.isCheckingUserName = val?.length >= 3; }),
      debounceTime(400),
      distinctUntilChanged(),
      tap(val => {
        this.userNameTaken = false;
      }),
      filter(val => val && val.length >= 3),
      switchMap(val => this.userService.userNameExists(val))
    ).subscribe({
      next: (res: any) => {
        this.isCheckingUserName = false;
        this.userNameTaken = !!res;
      },
      error: () => {
        this.isCheckingUserName = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signUpForm.invalid || this.userNameTaken) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { userName, firstName, lastName, email, password } = this.signUpForm.value;
    this.userService.getTokenBySignUp(userName, firstName, lastName, email, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        this.authService.checkAuthStatus();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {

      }
    })
  }

  onSignIn() {
    this.router.navigate(['/signin']);
  }
}
