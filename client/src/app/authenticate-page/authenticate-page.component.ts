import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonCheckbox,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline,
  eyeOffOutline,
  logoInstagram,
  logoGoogle,
  logoFacebook,
} from 'ionicons/icons';
import { AuthService } from '../shared/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticate-page',
  templateUrl: './authenticate-page.component.html',
  styleUrls: ['./authenticate-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonIcon,
    IonCheckbox,
    IonButton,
  ],
})
export class AuthenticatePageComponent implements OnInit {
  isLoginMode = true;
  showPassword = false;
  showConfirmPassword = false;

  email = 'testaccount@gmail.com';
  password = '123456';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      logoInstagram,
      logoGoogle,
      logoFacebook,
    });
  }

  ngOnInit() {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async submitForm() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Vui lòng nhập email và mật khẩu';
      return;
    }

    if (this.isLoginMode) {
      try {
        const user = await this.authService.login(this.email, this.password);
        console.log('User ID:', user.uid);
        this.router.navigate(['/tabs/home']);
      } catch (err: any) {
        this.errorMessage =
          'Đăng nhập thất bại, tài khoản hoặc mật khẩu chưa đúng';
      }
    } else {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Mật khẩu xác nhận không khớp';
        return;
      }

      try {
        const user = await this.authService.register(this.email, this.password);
        console.log('User ID:', user.uid);
        this.router.navigate(['/tabs/home']);
      } catch (err: any) {
        this.errorMessage = 'Đăng ký thất bại: ' + err.message;
      }
    }
  }
}
