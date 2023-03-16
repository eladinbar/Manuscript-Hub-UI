import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {RouterEnum} from "./enums/RouterEnum";
import {DocumentDetailsComponent} from "./pages/document-details/document-details.component";
import {LoginComponent} from "./account/login/login.component";
import {MainComponent} from "./main/main.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],

    children: [
      {path: RouterEnum.Dashboard, component: DashboardComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},


  {path: RouterEnum.Home, component: MainComponent},
  {
    path: RouterEnum.DocumentDetail + '/:' + RouterEnum.DocumentId,
    component: DocumentDetailsComponent,
  },
  {path: '**', component: MainComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
