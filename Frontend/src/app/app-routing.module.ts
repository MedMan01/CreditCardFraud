import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PredictionComponent } from './prediction/prediction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"login", component:LoginComponent},
  {path:"stats", component:StatsComponent},
  {path:"admin", component:AdminTemplateComponent,
    canActivate:[AuthGuard],
    children:[
      {path:"home", component:HomeComponent},
      {path:"dashboard", component:DashboardComponent},
      {path:"transaction", component:TransactionComponent},
      {path:"prediction", component:PredictionComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
