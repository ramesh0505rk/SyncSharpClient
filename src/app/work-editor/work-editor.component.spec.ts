import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkEditorComponent } from './work-editor.component';

describe('WorkEditorComponent', () => {
  let component: WorkEditorComponent;
  let fixture: ComponentFixture<WorkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
