import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExploreCardComponent } from './explore-card.component';

describe('ExploreCardComponent', () => {
  let component: ExploreCardComponent;
  let fixture: ComponentFixture<ExploreCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExploreCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
