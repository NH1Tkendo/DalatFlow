import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  canActivate() {
    // Gọi authState thông qua inject hoặc cung cấp sẵn trong DI.
    // Dùng user từ AuthService hoặc inject Auth
    return authState(this.auth).pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
    );
  }
}
