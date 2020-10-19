import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = ''

  constructor(private http: HttpClient, public  afAuth:  AngularFireAuth, private router: Router) { }


  get usuario(){

     let user = JSON.parse(localStorage.getItem('users'));

     return user;
  }

  isAuthenticated(){

    if(localStorage.getItem('users') != null){
       return true;
    }else{
       return false;
    }
  }
  /**
   * Create User with Email and Password
   */
  createUser(user: any){
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  deleteUser(userId:any){

  }

  /**
   * Sign User with Email and Password
   * save to LocalStorage Email and Sign
   */

  signUser(email:any, password:any, remember: boolean = false){

    if(remember){
        localStorage.setItem('email',email);
    }else{
        localStorage.removeItem('email');
    }
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logout remove LocalStorage
   * and SignOut method and link Login
   */

  async logout(){
    localStorage.removeItem('users');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    //await this.afAuth.signOut();
    this.afAuth.signOut().then(() => {
    }, (error) => {
      console.log(error);
    });


    this.router.navigate(['/login']);

  }

  /**
   * Estado authState
   */

  isAuth(): any{
      return this.afAuth.authState;
  }

  /**
   * Login with Google Account, open popup
   */

  async loginGoogle(){
    try{
        return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
    }catch(err){
      console.log(err)
    }
  }

  /**
   * Status User get Token
   */

  statusUser(){
     console.log(localStorage.getItem('token'));
    if(localStorage.getItem('token') == 'undefined' || localStorage.getItem('token') == null ){
       return false;
    }else{
      return true;

    }
   /*this.afAuth.authState.subscribe(user => {
      if (user){
          console.log(user);
          return true;
      } else {
        localStorage.setItem('user', null);
          return false;
      }
     });*/
   }
}
