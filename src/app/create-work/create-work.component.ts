import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal, NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';
import { WorkService } from '../services/work.service';
import { CreateWork } from '../Models/work.model';

@Component({
  selector: 'app-create-work',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgbAccordionItem],
  templateUrl: './create-work.component.html',
  styleUrl: './create-work.component.scss'
})
export class CreateWorkComponent implements OnInit {
  @Input() userID: string = '';

  createWorkForm!: FormGroup;
  languages: string[] = ['C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Ruby', 'PHP', 'C++', 'C'];
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private workService: WorkService) { }

  ngOnInit(): void {
    this.initializeCreateWorkForm();
    this.setupCustomSelect();
    document.querySelectorAll<HTMLElement>('app-create-work').forEach(ele => {
      if (ele.parentElement) {
        ele.parentElement.style.borderRadius = '15px';
        ele.parentElement.style.minWidth = '350px';
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

  onCreate() {
    var request = {
      title: this.createWorkForm.get('title')?.value,
      description: this.createWorkForm.get('description')?.value,
      language: this.createWorkForm.get('language')?.value,
      code: '',
      createdBy: this.userID
    };

    console.log('Creating work with request:', request);

    this.workService.createWork(request).subscribe({
      next: (response) => {
        console.log('Work created successfully:', response);
        this.activeModal.close('created');
      },
      error: (err) => {
        console.error('Error creating work:', err);
        alert('Failed to create work. Please try again.');
      }
    })
  }

  setupCustomSelect() {
    const wrapper = document.querySelector('.custom-select-wrapper');
    const trigger = wrapper?.querySelector('.custom-select-trigger');
    const dropdown = wrapper?.querySelector('.custom-select-dropdown');

    trigger?.addEventListener('click', () => {
      trigger.classList.toggle('open');
      dropdown?.classList.toggle('open');
    });

    dropdown?.addEventListener('click', (e) => {
      const opt = (e.target as HTMLElement).closest('.custom-select-option');
      if (!opt || opt.classList.contains('placeholder-option')) return;

      const label = wrapper?.querySelector('.selected-label');
      if (label) label.textContent = opt.textContent;
      this.createWorkForm.get('language')?.setValue(opt.getAttribute('data-value'));
      trigger?.classList.remove('open');
      dropdown?.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!wrapper?.contains(e.target as Node)) {
        trigger?.classList.remove('open');
        dropdown?.classList.remove('open');
      }
    });
  }
}
