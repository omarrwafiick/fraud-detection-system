import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleBuilderPage } from './rule-builder.page';

describe('RuleBuilderPage', () => {
  let component: RuleBuilderPage;
  let fixture: ComponentFixture<RuleBuilderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleBuilderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleBuilderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
