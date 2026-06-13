import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsPage } from './case-details.page';

describe('CaseDetailsPage', () => {
  let component: CaseDetailsPage;
  let fixture: ComponentFixture<CaseDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
