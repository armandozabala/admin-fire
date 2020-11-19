import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2'
import { saveAs } from 'file-saver';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  title = 'fileUpload';
  archivos;
  descarga:any;
  finalizado = false;
  progreso = 0;
  multipleImages = [];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.archivos = file;
    }
  }

  onDownload(archivo:any){


      this.http.get("download/"+archivo, {responseType: "blob" }) //set response Type properly (it is not part of headers)
               .toPromise()
                .then(blob => {
                    saveAs(blob, archivo);
                })
               .catch(err => console.error("download error = ", err));

  }


  onSubmit(){


    if(this.archivos == undefined){
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe cargar primero un archivo!',
      });
    }
    else{
    let formData = new FormData();
    formData.append('archivo', this.archivos);

    const req = new HttpRequest('POST','upload/subidos/geo_file', formData, {
          reportProgress: true
    });

    this.http.request(req).subscribe( event => {

      if(event.type === HttpEventType.UploadProgress){

              this.progreso = Math.round((event.loaded/event.total) * 100);


      }else if(event.type === HttpEventType.Response){
           let response: any = event.body;
           this.finalizado = response.ok;
           swal.fire({
            icon: 'success',
            title: 'Procesado Correctamente!',
            text: 'Archivo '+this.archivos.name+' cargado! ',
          });
           this.descarga = response.path;
      }

    });
   }
  }

}
