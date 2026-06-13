import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGraphVisualizerPage } from './network-graph-visualizer.page';

describe('NetworkGraphVisualizerPage', () => {
  let component: NetworkGraphVisualizerPage;
  let fixture: ComponentFixture<NetworkGraphVisualizerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkGraphVisualizerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkGraphVisualizerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
