import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonImg} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonImg],
})
export class HomePage {
  


  constructor(private auth:AuthService, private router: Router) {}

  goToSection(section: string) {
    this.router.navigate([`/${section}`]);
  }

  logout():void{
    this.auth.logout()
  }
}
