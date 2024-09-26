import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { User, UserCredential} from 'firebase/auth';
import { getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { Firestore,  addDoc, getDocs, query,  where, collection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {
  }

  async login({ email, password }: any): Promise<UserCredential | undefined> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  async getCurrentUser() {
    return await this.auth.currentUser;
  }

   // Método para registrar un usuario en Firestore
   async registerUser(user: any) {
    const userCollection = collection(this.firestore, 'usuarios');
    return addDoc(userCollection, user);
  }

  // Método para verificar si el usuario ya existe
  async userExists(email: string): Promise<boolean> {
    const userCollection = collection(this.firestore, 'usuarios');
    const q = query(userCollection, where('correo', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}