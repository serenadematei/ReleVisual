import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonButtons } from '@ionic/angular/standalone';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController, ToastController} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.page.html',
  styleUrls: ['./cosas-lindas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonFooter, IonButtons]
})
export class CosasLindasPage {

  constructor(
    private router: Router,
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
  
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
  
      if (!image.webPath) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo obtener la imagen. Inténtalo de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      // Convertir el URI de la imagen a un blob
      const response = await fetch(image.webPath);
      const blob = await response.blob();
  
      console.log('Blob size:', blob.size, 'type:', blob.type); // Depurar el blob
  
      const storage = getStorage();
      const filePath = `cosas-lindas/${user.uid}_${new Date().getTime()}.jpg`;  // Ruta para almacenar la imagen
      const storageRef = ref(storage, filePath);
  
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo foto...',
      });
      await loading.present();
  
      // Subir la imagen a Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on(
        'state_changed',
        null,
        async (error) => {
          console.error('Error al subir la imagen:', error);
          await loading.dismiss();
        },
        async () => {
          // Obtener la URL de descarga de la imagen subida
          const downloadURL = await getDownloadURL(storageRef); // Asegurarse de obtener la URL correctamente
  
          console.log('Download URL:', downloadURL); // Depurar la URL
  

          const fotosCollection = collection(this.firestore, 'fotos-cosas-lindas');
          await addDoc(fotosCollection, {
            url: downloadURL,
            user: user.email || user.uid,
            timestamp: Timestamp.fromDate(new Date()),
            votos: 0, 
            usuariosQueVotaron: [] 
          });
  
          await loading.dismiss();
          console.log('Foto subida con exito');
          
          const toast = await this.toastCtrl.create({
            message: '¡Foto subida con éxito!',
            duration: 2000,
            color: 'success', // Cambia el color del toast
            cssClass: 'custom-toast', //no funca
          });
          await toast.present();
        }
      );
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Hubo un problema al tomar o subir la foto.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

    /*
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
    
      // Tomar la foto
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (!image.webPath) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo obtener la imagen. Inténtalo de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    

      const response = await fetch(image.webPath);
      const blob = await response.blob();
    
      console.log('Blob size:', blob.size, 'type:', blob.type); 
    
      const storage = getStorage();
      const filePath = `cosas-lindas/${user.uid}_${new Date().getTime()}.jpg`;  
      const storageRef = ref(storage, filePath);
    
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
    
     
          const fotosCollection = collection(this.firestore, 'fotos-cosas-lindas');
          await addDoc(fotosCollection, {
            url: downloadURL,
            user: user.email || user.uid,
            timestamp: Timestamp.fromDate(new Date()),
            votos: 0, // Campo para el número de votos, inicial en 0
            usuariosQueVotaron: [] // Lista vacía para almacenar los usuarios que votaron
          });
    
          await loading.dismiss();
          console.log('Foto subida con éxito!');
          

          const toast = await this.toastCtrl.create({
            message: '¡Foto subida con éxito!',
            duration: 2000,
            color: 'success', // Cambia el color del toast
            cssClass: 'custom-toast', // Clase personalizada para cambiar estilos
          });
          await toast.present();
        }
      );
    }*/


  public goToListadoFotos(tipo: string) {
    this.router.navigate(['/listadoFotos', { tipo }]);
  }

  public goTo(path: string) {
    this.router.navigate([path]);
  }
}
  

  /* PRIMER VERSION DE TAKE PICTURE
  async takePicture() {

    const user = await this.authService.getCurrentUser();

    if (!user) {

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debes estar autenticado para subir una foto.',
        buttons: ['OK']
      });
      await alert.present();

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
    const filePath = `cosas-lindas/${user.uid}_${new Date().getTime()}.jpg`; 
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


        const fotosCollection = collection(this.firestore, 'fotos-cosas-lindas');
        await addDoc(fotosCollection, {
          url: downloadURL,
          user: user.email || user.uid,
          timestamp: Timestamp.fromDate(new Date()),
          votos: 0, // Campo para el número de votos, inicial en 0
          usuariosQueVotaron: [] // Lista vacía para almacenar los usuarios que votaron
        });

        await loading.dismiss();
        console.log('Foto subida con éxito!');
        

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
  }*/
