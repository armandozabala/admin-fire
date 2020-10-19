import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

      if(!this.authService.isAuthenticated()){

              Swal.fire({
                    heightAuto: false,
                      icon: 'error',
                      title: 'Oops...',
                      text: 'is not Auth!',
              });

            this.router.navigate(['/login'])
      }
  }

}
