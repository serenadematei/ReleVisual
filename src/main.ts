import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
     provideFirebaseApp(() => initializeApp({"projectId":"pps-login-1cb71","appId":"1:453954408711:web:2820d0a5571255dea035a2","storageBucket":"pps-login-1cb71.appspot.com","apiKey":"AIzaSyDCCZC1J1ydeRjiyFhR0TX6KNtt2z9II-w","authDomain":"pps-login-1cb71.firebaseapp.com","messagingSenderId":"453954408711"})), 
     provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
  ],
});
