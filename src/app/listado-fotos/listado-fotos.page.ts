import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonButtons, IonFooter } from '@ionic/angular/standalone';
import { Firestore, collectionData, query, orderBy, where, collection, updateDoc, doc} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc } from 'firebase/firestore';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-fotos',
  templateUrl: './listado-fotos.page.html',
  styleUrls: ['./listado-fotos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList,  IonItem, IonThumbnail, IonLabel, IonCard, IonCardHeader, IonCardTitle,IonButton, IonIcon, IonButtons, IonFooter]
})
export class ListadoFotosPage implements OnInit {

  fotos: any[] = [];
  tipo: string = '';
  userEmail: string | null = null; 


  constructor(private route: ActivatedRoute, private firestore: Firestore, private authService: AuthService, private cd: ChangeDetectorRef, private router:Router) {}

  async ngOnInit() {
    // Obtener el parámetro de navegación
    this.tipo = this.route.snapshot.paramMap.get('tipo') || 'lindas';  // Por defecto "lindas"

     const user = await this.authService.getCurrentUser();
     if (user) {
      console.log("soy usaurio: " + user.email)
       this.userEmail = user.email; 
     }
     else
     {
       console.log("error")
     }

    this.cargarFotos();//firestore
  }
    
    cargarFotos() {
      let user = this.authService.getCurrentUser();
      const collectionName = this.tipo === 'feas' ? 'fotos-cosas-feas' : 'fotos-cosas-lindas';
      const fotosRef = collection(this.firestore, collectionName);
      const q = query(fotosRef, orderBy('timestamp', 'desc'));
  

      collectionData(q, { idField: 'id' }).subscribe((data) => {
        this.fotos = data.map(foto => ({
          ...foto,
          yaVotado: foto['usuariosQueVotaron']?.includes(this.userEmail) 
        }));
      });
    }

    async votar(foto: any) {

      const user = await this.authService.getCurrentUser();
      if (!user) {
        console.log("El usuario no está logueado.");
        return;
      }
    
      const collectionName = this.tipo === 'feas' ? 'fotos-cosas-feas' : 'fotos-cosas-lindas';
      const fotoDocRef = doc(this.firestore, `${collectionName}/${foto.id}`);
    

      const yaVotado = foto.usuariosQueVotaron?.includes(user.email);
    
      let newVotos: number;
      let nuevosUsuariosQueVotaron: string[];
    
      if (yaVotado) {

        newVotos = Number(foto.votos) - 1;
        nuevosUsuariosQueVotaron = foto.usuariosQueVotaron.filter((email: string) => email !== user.email);
      } else {

        newVotos = Number(foto.votos) + 1;
        nuevosUsuariosQueVotaron = [...(foto.usuariosQueVotaron || []), user.email];
      }
    
      try {

        await updateDoc(fotoDocRef, {
          votos: newVotos,
          usuariosQueVotaron: nuevosUsuariosQueVotaron
        });
    

        foto.votos = newVotos;
        foto.usuariosQueVotaron = nuevosUsuariosQueVotaron;
        foto.yaVotado = !yaVotado;  
    

        console.log(yaVotado ? "Voto removido" : "Voto registrado");
    
      } catch (error) {
        console.error("Error actualizando el voto:", error);
      }
    }

    public goTo(path: string) {
      this.router.navigate([path]);
    }
    /*
    async votar(foto: any) {

      const user = await this.authService.getCurrentUser();
      if (!user) {
        console.log("El usuario no está logueado.");
        return;
      }
  
      const collectionName = this.tipo === 'feas' ? 'fotos-cosas-feas' : 'fotos-cosas-lindas';
      const fotoDocRef = doc(this.firestore, `${collectionName}/${foto.id}`);
  

      const yaVotado = foto.usuariosQueVotaron?.includes(user.email);
  
      let newVotos: number;
      let nuevosUsuariosQueVotaron;
  
      if (yaVotado) {

        newVotos = Number(foto.votos) - 1;
        nuevosUsuariosQueVotaron = foto.usuariosQueVotaron.filter((email: string) => email !== user.email);
      } else {

        newVotos = Number(foto.votos) + 1;
        nuevosUsuariosQueVotaron = [...(foto.usuariosQueVotaron || []), user.email];
      }

      await updateDoc(fotoDocRef, {
        votos: newVotos,
        usuariosQueVotaron: nuevosUsuariosQueVotaron
      });
  

      foto.votos = newVotos;
      foto.yaVotado = !yaVotado;  
  
      console.log(yaVotado ? "Voto removido" : "Voto registrado");
    }
   */
}
