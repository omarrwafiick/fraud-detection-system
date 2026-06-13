import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOne } from './select-one';

describe('SelectOne', () => {
  let component: SelectOne;
  let fixture: ComponentFixture<SelectOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOne);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
