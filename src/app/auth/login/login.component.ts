import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FirestoreService } from 'src/app/service/firebase.service';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  forma: FormGroup;

  constructor(private auth: AuthService, private firebase: FirestoreService, public router: Router) { }


  ngOnInit(): void {

    this.forma = new FormGroup({
      email: new FormControl( null,  [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });

  }



  loginUser(){

    //this.blockUI.start();

      if(this.forma.valid){

      this.auth.signUser(this.forma.value.email, this.forma.value.password, this.forma.value.remember).then( (data:any)=>{


          if(data.user){

            //console.log(data.user);
            //console.log(data.user.uid);

            this.firebase.getUserUID(data.user.uid).subscribe((resp) => {

                console.log(resp);

                //localStorage.setItem("user",JSON.stringify(resp[0]));

                this.router.navigate(['/dashboard']);


            });

            //
          }

      }).catch(err =>{

        //this.blockUI.stop();

                     Swal.fire({
                              heightAuto: false,
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Check email and password is wrong!',
                         });
                     });
         }else{


          Swal.fire({
            heightAuto: false,
            icon: 'error',
            title: 'Oops...',
            text: 'Check email and password is wrong!!',
          });


    }

}

}
