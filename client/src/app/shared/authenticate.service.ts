import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<any>;
  private auth = inject(Auth);

  constructor() {
    this.user$ = authState(this.auth);
  }

  // 1. ĐĂNG KÝ
  async register(email: string, pass: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // 2. ĐĂNG NHẬP
  async login(email: string, pass: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // 3. ĐĂNG XUẤT
  async logout() {
    await signOut(this.auth);
  }
}
