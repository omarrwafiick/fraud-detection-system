import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudTrendsLineChart } from './fraud-trends-line-chart';

describe('FraudTrendsLineChart', () => {
  let component: FraudTrendsLineChart;
  let fixture: ComponentFixture<FraudTrendsLineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraudTrendsLineChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudTrendsLineChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
