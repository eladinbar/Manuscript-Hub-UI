import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDocumentsComponent } from './layout-documents.component';

describe('LayoutDocumentsComponent', () => {
  let component: LayoutDocumentsComponent;
  let fixture: ComponentFixture<LayoutDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutDocumentsComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
