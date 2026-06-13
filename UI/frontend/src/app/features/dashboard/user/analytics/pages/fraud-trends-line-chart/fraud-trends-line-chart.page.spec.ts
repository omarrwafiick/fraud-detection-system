import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudTrendsLineChartPage } from './fraud-trends-line-chart.page';

describe('FraudTrendsLineChartPage', () => {
  let component: FraudTrendsLineChartPage;
  let fixture: ComponentFixture<FraudTrendsLineChartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraudTrendsLineChartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudTrendsLineChartPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
