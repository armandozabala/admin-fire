import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FirestoreService } from 'src/app/service/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(private auth: AuthService, private firebase: FirestoreService, public router: Router) { }

  ngOnInit(): void {

    this.forma = new FormGroup({
      firstname: new FormControl( null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl(true)
  }, {
      validators: this.samePassword('password','password2')
  });

  }


  samePassword(field1: string, field2: string){
    return (group: FormGroup) => {

      let pass1 = group.controls[field1].value;
      let pass2 = group.controls[field2].value;

        if(pass1===pass2){
            return null;
        }

        return {
          samePassword: true
        }
    }
}


registerUser(){

  console.log("PUSH");


  if(this.forma.invalid){

    Swal.fire('Oops...', 'Check form!', 'error');
      return;
  }




  this.auth.createUser(this.forma.value).then((data) => {

       // console.log(data.user.uid);

        this.forma.value.id = data.user.uid;

        this.firebase.createUserUID(this.forma.value).then((datas) => {
              //console.log(datas);


          Swal.fire('Good job!', 'Succesful!', 'success');
          this.router.navigate(['/login']);

        }).catch((error)=>{
             console.log(error);
        });

  }).catch((error)=>{

     Swal.fire('Oops...', 'Check email and password is wrong!', 'error');
  });
}

}
