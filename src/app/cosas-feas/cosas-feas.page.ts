import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.page.html',
  styleUrls: ['./cosas-feas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class CosasFeasPage {

  constructor(
    private router:Router, 
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async takePicture() {

    const user = await this.authService.getCurrentUser();

    if (!user) {
    
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debes estar autenticado para subir una foto.',
        buttons: ['OK']
      });
      await alert.present();
      return; 
    }


    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });


    if (!image.dataUrl) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo obtener la imagen. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const base64Image = image.dataUrl;  
    const storage = getStorage();
    const filePath = `cosas-feas/${user.uid}_${new Date().getTime()}.jpg`; 
    const storageRef = ref(storage, filePath);

    const blob = this.dataURLtoBlob(base64Image);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    const loading = await this.loadingCtrl.create({
      message: 'Subiendo foto...',
    });
    await loading.present();

    uploadTask.on(
      'state_changed',
      null,
      async (error) => {
        console.error('Error al subir la imagen:', error);
        await loading.dismiss();
      },
      async () => {

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);


        const fotosCollection = collection(this.firestore, 'fotos-cosas-feas');
        await addDoc(fotosCollection, {
          url: downloadURL,
          user: user.email || user.uid,
          timestamp: Timestamp.fromDate(new Date()),
          votos: 0
        });

        await loading.dismiss();
        console.log('Foto subida con éxito!');
           // Mostrar un toast personalizado
      const toast = await this.toastCtrl.create({
        message: '¡Foto subida con éxito!',
        duration: 2000,
        color: 'success', // Cambia el color del toast
        cssClass: 'custom-toast', // Clase personalizada para cambiar estilos
      });
      await toast.present();
      }
    );
  }


  private dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  public goToListadoFotos(tipo:string){
    this.router.navigate(['/listadoFotos', { tipo }]);
  }

  public goToResultados(tipo:string){
    this.router.navigate(['/resultados', { tipo }]);
  }

  public goTo(path: string) {
    this.router.navigate([path]);
  }
}
