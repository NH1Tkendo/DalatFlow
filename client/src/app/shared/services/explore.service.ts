import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private auth = inject(Auth);
  private apiUrl = `${environment.apiUrl}/api/itineraries/`;

  constructor(private http: HttpClient) {}

  getItineraries(): Observable<any> {
    const user = this.auth.currentUser;

    if (user) {
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          });
          return this.http.get<any>(this.apiUrl, { headers });
        }),
      );
    }

    // Default call without token if user not logged in or route doesn't need it
    return this.http.get<any>(this.apiUrl);
  }

  getMyItineraries(): Observable<any> {
    const user = this.auth.currentUser;

    if (user) {
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          });
          return this.http.get<any>(`${this.apiUrl}my-itineraries`, {
            headers,
          });
        }),
      );
    }

    throw new Error('User not logged in');
  }

  getItineraryById(id: string): Observable<any> {
    const user = this.auth.currentUser;
    const url = `${this.apiUrl}${id}`;

    if (user) {
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          });
          return this.http.get<any>(url, { headers });
        }),
      );
    }

    // Fallback without token
    return this.http.get<any>(url);
  }
}
