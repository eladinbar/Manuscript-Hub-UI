import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmSubmissionFormComponent } from './algorithm-submission-form.component';

describe('AlgorithmUploadFormComponent', () => {
  let component: AlgorithmSubmissionFormComponent;
  let fixture: ComponentFixture<AlgorithmSubmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmSubmissionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
