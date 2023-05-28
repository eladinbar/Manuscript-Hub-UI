import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {RouterEnum} from "./enums/RouterEnum";
import {LoginComponent} from "./components/pages/account/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RegisterComponent} from "./components/pages/account/register/register.component";
import {DocumentUploadFormComponent} from "./components/pages/document-upload-form/document-upload-form.component";
import {AlgorithmSubmissionFormComponent} from "./components/pages/algorithm-submission-form/algorithm-submission-form.component";
import {InvitationsComponent} from "./components/pages/invitations/invitations.component";
import {LayoutDocumentsComponent} from "./components/pages/layout-documents/layout-documents.component";
import {AlgorithmRequestsComponent} from "./components/pages/algorithm-requests/algorithm-requests.component";
import {AdminGuard} from "./shared/guards/admin.guard";
import {DeveloperGuard} from "./shared/guards/developer.guard";
import {GuestGuard} from "./shared/guards/guest.guard";

const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],

    children: [
      {path: RouterEnum.Dashboard, component: DashboardComponent},

      {path: RouterEnum.DocumentDetail + '/:' + RouterEnum.DocumentId, component: LayoutDocumentsComponent},
      {path: RouterEnum.DocumentUpload, component: DocumentUploadFormComponent},

      {path: RouterEnum.AlgorithmSubmissionForm, component: AlgorithmSubmissionFormComponent, canActivate: [DeveloperGuard]},
      {path: RouterEnum.AlgorithmRequests, component: AlgorithmRequestsComponent, canActivate: [DeveloperGuard]},

      {path: RouterEnum.InvitationRequests, component: InvitationsComponent, canActivate: [AdminGuard]},
    ]
  },

  {path: RouterEnum.Login, component: LoginComponent, canActivate: [GuestGuard]},

  {path: RouterEnum.Register, component: RegisterComponent, canActivate: [GuestGuard]},

  {path: RouterEnum.Home, component: MainComponent},

  {path: '**', component: MainComponent, redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
