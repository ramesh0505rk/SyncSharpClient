import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal, NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-work',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-work.component.html',
  styleUrl: './create-work.component.scss'
})
export class CreateWorkComponent implements OnInit {
  createWorkForm!: FormGroup;
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    document.querySelectorAll<HTMLElement>('app-create-work').forEach(ele => {
      if (ele.parentElement) {
        ele.parentElement.style.borderRadius = '15px';
        ele.parentElement.style.minWidth = '500px';
        ele.parentElement.style.border = '1px solid rgb(128, 128, 128, 0.2)';
        ele.parentElement.style.backgroundColor = '#111111';
      }
    });
  }

  initializeCreateWorkForm() {
    this.createWorkForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      language: ['', Validators.required],
    })
  }
}
