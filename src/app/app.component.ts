import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DynamicSplashComponent } from './dynamic-splash/dynamic-splash.component';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, NgIf, DynamicSplashComponent],
})
export class AppComponent {
  
  showAnimatedSplash = true; // Variable para mostrar el splash animado DESCOMENTAR.

  constructor(private router: Router) {}

  ngOnInit() {
    // Ocultar el splash estático de Capacitor después de 3 segundos
   
    setTimeout(() => {
      SplashScreen.hide();
      // Mostrar el splash animado
      this.showAnimatedSplash = true;

      // Ocultar el splash animado después de 3 segundos
      setTimeout(() => {
        this.showAnimatedSplash = false;
        this.router.navigate(['/home']); // Navegar a la página principal
      }, 3000); // Duración del splash animado
    }, 3000); // Duración del splash estático
  }
}
