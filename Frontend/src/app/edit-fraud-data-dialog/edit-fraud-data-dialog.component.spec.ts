import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFraudDataDialogComponent } from './edit-fraud-data-dialog.component';

describe('EditFraudDataDialogComponent', () => {
  let component: EditFraudDataDialogComponent;
  let fixture: ComponentFixture<EditFraudDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFraudDataDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFraudDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
