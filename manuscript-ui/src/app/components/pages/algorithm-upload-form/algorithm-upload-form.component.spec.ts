import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmUploadFormComponent } from './algorithm-upload-form.component';

describe('AlgorithmUploadFormComponent', () => {
  let component: AlgorithmUploadFormComponent;
  let fixture: ComponentFixture<AlgorithmUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmUploadFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
