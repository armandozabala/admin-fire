import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './../app-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficasComponent } from './graficas/graficas.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { UsersComponent } from './users/users.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    GraficasComponent,
    PagesComponent,
    UsersComponent,
    UploadComponent
  ],
  exports:[
    DashboardComponent,
    ProgressComponent,
    GraficasComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgxPaginationModule,
    OrderModule,
    Ng2SearchPipeModule
  ]
})
export class PagesModule { }
