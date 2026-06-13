import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesListPage } from './cases-list.page';

describe('CasesListPage', () => {
  let component: CasesListPage;
  let fixture: ComponentFixture<CasesListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
