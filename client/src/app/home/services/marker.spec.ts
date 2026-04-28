import { TestBed } from '@angular/core/testing';

import { Marker } from './marker.service';

describe('Marker', () => {
  let service: Marker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Marker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
