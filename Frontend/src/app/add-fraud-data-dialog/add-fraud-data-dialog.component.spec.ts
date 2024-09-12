import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFraudDataDialogComponent } from './add-fraud-data-dialog.component';

describe('AddFraudDataDialogComponent', () => {
  let component: AddFraudDataDialogComponent;
  let fixture: ComponentFixture<AddFraudDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFraudDataDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFraudDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
