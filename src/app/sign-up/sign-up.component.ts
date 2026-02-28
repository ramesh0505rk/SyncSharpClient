import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { last } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  togglePasswordVisibility(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(){
    if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
      return;
    }
    console.log(this.signUpForm.get('firstName')?.value, this.signUpForm.get('lastName')?.value, this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value);
  }

  onSignIn(){
    this.router.navigate(['/signin']);
  }
}
