import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonItem, IonText, IonButton, IonInput, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { AuthErrorCodes } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonText, IonItem, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardHeader, IonCardTitle]
})
export class LoginPage implements OnInit {


  email: any;
  password: any;

  errorMessage: string = '';

  constructor(private authService: AuthService,  private router: Router) {}
  
  ngOnInit() {}

  usuariosPredeterminados(usuario: string): void {
    let auxEmail: string = '';
    let auxPassword: string = ''; 
  
    switch (usuario) {
      case 'admin':
        auxEmail = 'admin@admin.com';
        auxPassword = "111111"
        break;
      case 'invitado':
        auxEmail = 'invitado@invitado.com';
         auxPassword = "222222"
        break;
      case 'usuario':
        auxEmail = 'usuario@usuario.com';
        auxPassword = "333333"
        break;
      case 'anonimo':
        auxEmail = 'anonimo@anonimo.com';
        auxPassword = "444444"
        break;
      case 'tester':
          auxEmail = 'tester@tester.com';
          auxPassword = "555555"
          break;
      default:
        auxEmail = '';
    }
  
    this.email = auxEmail;
    this.password = auxPassword;
  }
  async login() {
    let credenciales = { email: this.email, password :this.password };
    await this.authService.login(credenciales)
      .then((res) => {
        this.email = '';  
        this.password = '';  
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        if (e.code === AuthErrorCodes.INVALID_EMAIL || e.code === AuthErrorCodes.USER_DELETED) {
          this.errorMessage = 'El correo ingresado no es válido. Por favor, inténtelo de nuevo';
        } else {
          this.errorMessage = 'Usuario o contraseña incorrecta. Por favor, inténtelo de nuevo';
        }
      });
  }

}
