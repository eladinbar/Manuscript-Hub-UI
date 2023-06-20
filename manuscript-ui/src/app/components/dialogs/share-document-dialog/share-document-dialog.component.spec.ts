import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDocumentDialogComponent } from './share-document-dialog.component';

describe('ShareDocumentDialogComponent', () => {
  let component: ShareDocumentDialogComponent;
  let fixture: ComponentFixture<ShareDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareDocumentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
