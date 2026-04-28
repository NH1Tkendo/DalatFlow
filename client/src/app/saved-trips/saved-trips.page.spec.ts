import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedTripsPage } from './saved-trips.page';

describe('SavedTripsPage', () => {
  let component: SavedTripsPage;
  let fixture: ComponentFixture<SavedTripsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
