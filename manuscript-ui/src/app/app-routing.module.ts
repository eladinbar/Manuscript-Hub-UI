import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {RouterEnum} from "./enums/RouterEnum";
import {DocumentDetailsComponent} from "./components/pages/document-details/document-details.component";
import {LoginComponent} from "./components/pages/account/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RegisterComponent} from "./components/pages/account/register/register.component";
import {AlgorithmSubmissionFormComponent} from "./components/pages/algorithm-submission-form/algorithm-submission-form.component";
import {InvitationsComponent} from "./components/pages/invitations/invitations.component";
import {LayoutDocumentsComponent} from "./components/pages/layout-documents/layout-documents.component";
import {AlgorithmRequestsComponent} from "./components/pages/algorithm-requests/algorithm-requests.component";

const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],

    children: [
      {path: RouterEnum.Dashboard, component: DashboardComponent},
      {path: 'InvitationRequests', component: InvitationsComponent},

      {path: RouterEnum.DocumentDetail + '/:' + RouterEnum.DocumentId, component: LayoutDocumentsComponent},

      {path: RouterEnum.AlgorithmSubmissionForm, component: AlgorithmSubmissionFormComponent},
      {path: RouterEnum.AlgorithmRequests, component: AlgorithmRequestsComponent},
      {path: RouterEnum.InvitationRequests, component: InvitationsComponent},
    ]
  },

  {path: RouterEnum.Login, component: LoginComponent},

  {path: RouterEnum.Register, component: RegisterComponent},

  {path: RouterEnum.Home, component: MainComponent},

  {path: '**', component: MainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
