import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {RouterEnum} from "./enums/RouterEnum";
import {DocumentDetailsComponent} from "./pages/document-details/document-details.component";
import {LoginComponent} from "./account/login/login.component";

const routes: Routes = [
  {path:'login', component:LoginComponent},

  {path: RouterEnum.Dashboard, component: DashboardComponent},
  {
    path: RouterEnum.DocumentDetail + '/:' + RouterEnum.DocumentId,
    component: DocumentDetailsComponent,
  },
  {path: '', redirectTo: '/' + RouterEnum.Dashboard, pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
