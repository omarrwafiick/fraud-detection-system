import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGraphVisualizer } from './network-graph-visualizer';

describe('NetworkGraphVisualizer', () => {
  let component: NetworkGraphVisualizer;
  let fixture: ComponentFixture<NetworkGraphVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkGraphVisualizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkGraphVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
