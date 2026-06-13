import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMany } from './select-many';

describe('SelectMany', () => {
  let component: SelectMany;
  let fixture: ComponentFixture<SelectMany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
