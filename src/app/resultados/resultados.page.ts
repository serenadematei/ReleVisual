import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonFooter} from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { Firestore, collection, query, where, orderBy, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonFooter]
})
export class ResultadosPage implements OnInit {

  tipo: string = '';
  pieChart: any;
  barChart: any;

  fotosLindas: any[] = [];
  fotosFeas: any[] = [];
  fotoSeleccionada: any = null; // Para mostrar la foto seleccionada
  
  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute, private cd: ChangeDetectorRef ) {
    Chart.register(...registerables);
  }

  ngOnInit() {

    this.tipo = this.route.snapshot.paramMap.get('tipo') || 'lindas';  // Por defecto "lindas"
    this.generarGraficos();
  }



    async generarGraficos() {
      if (this.tipo === 'lindas') {
        const cosasLindas = await this.obtenerVotos('fotos-cosas-lindas');
    
        // Generar gráfico de torta (Cosas Lindas)
        this.pieChart = new Chart('pieChart', {
          type: 'pie',
          data: {
            labels: cosasLindas.map(foto => foto.user),
            datasets: [{
              data: cosasLindas.map(foto => foto.votos),
              backgroundColor: this.obtenerColores(cosasLindas.length),
              hoverOffset: 4
            }]
          }
        });
      } else if (this.tipo === 'feas') {
        const cosasFeas = await this.obtenerVotos('fotos-cosas-feas');
    
        // Generar gráfico de barra (Cosas Feas)
        this.barChart = new Chart('barChart', {
          type: 'bar',
          data: {
            labels: cosasFeas.map(foto => foto.user),
            datasets: [{
              label: 'Votos',
              data: cosasFeas.map(foto => foto.votos),
              backgroundColor: this.obtenerColores(cosasFeas.length)
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

  // Función para obtener los votos de las fotos
  async obtenerVotos(collectionName: string) {
    const fotosRef = collection(this.firestore, collectionName);
    const q = query(fotosRef, orderBy('votos', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const fotos: any[] = [];
    querySnapshot.forEach(doc => {
      fotos.push(doc.data());
    });

    return fotos;
  }

  // Función para generar colores aleatorios para los gráficos
  obtenerColores(num: number) {
    const colores = [];
    for (let i = 0; i < num; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      colores.push(color);
    }
    return colores;
  }
  
   // Función para mostrar la foto seleccionada
    // Función para mostrar la foto seleccionada
    mostrarFotoSeleccionada(event: any, elements: any, fotos: any[]) {
      if (elements.length > 0) {
        const index = elements[0].index;
        this.fotoSeleccionada = fotos[index]; // Mostrar la foto seleccionada
  
        console.log('Foto seleccionada:', this.fotoSeleccionada); // Verifica si se muestra en consola
        this.cd.detectChanges(); // Forzar la actualización de la vista en Angular
      }
    }


  public goTo(path: string) {
    this.router.navigate([path]);
  }
}
