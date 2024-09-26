import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
//import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonLabel, IonItem, IonCardHeader, IonCardContent, IonSelectOption, IonButton, IonText, IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports:[FormsModule,IonicModule,CommonModule] //[IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonLabel, IonItem, IonCardHeader, IonCardContent, IonSelectOption, IonButton, IonText, IonCardTitle, IonicModule]
})
export class RegistroPage{

  correo: string = '';
  clave: string = '';
  perfil: string = '';
  sexo: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    const user = {
      correo: this.correo,
      clave: this.clave,
      perfil: this.perfil,
      sexo: this.sexo,
    };

    console.log("1. Correo:" + this.correo + "y perfil:" + this.perfil)
    try {
      const userExists = await this.authService.userExists(user.correo);
      if (userExists) {
        this.errorMessage = 'El correo ya está registrado';
        return;
      }
      
      console.log("2. Correo:" + this.correo + "y perfil:" + this.perfil)
      await this.authService.registerUser(user);
      console.log("pase el wawit");
      this.errorMessage = '';
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.errorMessage = 'Error al registrar el usuario, intente de nuevo.';
    }
  }

}
