import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiKeyPage } from './api-key.page';

describe('ApiKeyPage', () => {
  let component: ApiKeyPage;
  let fixture: ComponentFixture<ApiKeyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiKeyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
