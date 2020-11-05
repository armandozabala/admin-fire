import { FirestoreService } from './../../service/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  p: number = 1;
  config:any;
  collection = { count: 0, data:[] };

  firstname:any = '';

  constructor(private firebase: FirestoreService) { }

  ngOnInit(): void {

      this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.collection.count
      }

      this.firebase.getUsers().subscribe(res => {


        this.collection.data = res.map( (e:any) =>{

              return{
                 id: e.payload.doc.id,
                 firstname: e.payload.doc.data().firstname,
                 lastname: e.payload.doc.data().lastname,
                 email: e.payload.doc.data().email,
              }

        })

      },err =>{
         console.log(err)
      });
  }

  editUser(item:any){
      console.log(item);
  }

  deleteUser(item:any){
    console.log(item);
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  key: string = 'id';
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = ! this.reverse;
  }

  search(){
      if(this.firstname == ""){
         this.ngOnInit();
      }else{
          this.collection.data = this.collection.data.filter(res =>{
                return res.firstname.toLocaleLowerCase().match(this.firstname.toLocaleLowerCase())
          })
      }
  }

}
