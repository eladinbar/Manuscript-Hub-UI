import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmRequestsComponent } from './algorithm-requests.component';

describe('AlgorithmRequestsComponent', () => {
  let component: AlgorithmRequestsComponent;
  let fixture: ComponentFixture<AlgorithmRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
