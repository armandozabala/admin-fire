import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  name:any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {


        if(this.auth.usuario.firstname){
          this.name = this.auth.usuario.firstname;
        }

  }

  logout(){
     this.auth.logout();
  }

}
