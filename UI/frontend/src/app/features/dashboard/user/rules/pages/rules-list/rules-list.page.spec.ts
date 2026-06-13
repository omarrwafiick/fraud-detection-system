import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesListPage } from './rules-list.page';

describe('RulesListPage', () => {
  let component: RulesListPage;
  let fixture: ComponentFixture<RulesListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RulesListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
