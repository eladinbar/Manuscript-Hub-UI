import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadFormComponent } from './document-upload-form.component';

describe('DocumentUploadFormComponent', () => {
  let component: DocumentUploadFormComponent;
  let fixture: ComponentFixture<DocumentUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentUploadFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
