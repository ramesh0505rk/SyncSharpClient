import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-editor',
  standalone: true,
  imports: [],
  templateUrl: './work-editor.component.html',
  styleUrl: './work-editor.component.scss'
})
export class WorkEditorComponent implements OnInit {
  @Input() workID!: string;

  ngOnInit(): void {
    console.log('WorkEditorComponent initialized with workID:', this.workID);
  }
}
