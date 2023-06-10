import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './components/pages/member/main/main.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTreeModule} from "@angular/material/tree";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDialogModule} from "@angular/material/dialog";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "./shared/material/material.module";
import {DashboardComponent} from './components/pages/member/dashboard/dashboard.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSortModule} from "@angular/material/sort";
import {DocumentDetailsComponent} from './components/document-details/document-details.component';
import {LoginComponent} from './components/pages/account/login/login.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {HttpErrorInterceptorService} from "./interceptors/http-error-interceptor.interceptor";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {RegisterComponent} from './components/pages/account/register/register.component';
import {AnnotationDialogComponent} from './components/dialogs/annotation-dialog/annotation-dialog.component';
import {DocumentItemComponent} from './components/document-item/document-item.component';
import {DocumentUploadFormComponent} from './components/pages/member/document-upload-form/document-upload-form.component';
import {PrivacyDialogComponent} from './components/dialogs/privacy-dialog/privacy-dialog.component';
import {ConfirmationDialogComponent} from './components/dialogs/confirmation-dialog/confirmation-dialog.component'
import {AlgorithmSubmissionFormComponent} from './components/pages/developer/algorithm-submission-form/algorithm-submission-form.component';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faQuestionCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {InvitationsComponent} from './components/pages/admin/invitations/invitations.component';
import {LayoutDocumentsComponent} from './components/pages/member/layout-documents/layout-documents.component';
import {AlgorithmRequestsComponent} from './components/pages/developer/algorithm-requests/algorithm-requests.component';
import {DocumentInfoDialogComponent} from "./components/dialogs/document-info-dialog/document-info-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    DocumentDetailsComponent,
    DocumentInfoDialogComponent,
    LoginComponent,
    RegisterComponent,
    AnnotationDialogComponent,
    DocumentItemComponent,
    DocumentUploadFormComponent,
    PrivacyDialogComponent,
    ConfirmationDialogComponent,
    AlgorithmSubmissionFormComponent,
    InvitationsComponent,
    LayoutDocumentsComponent,
    AlgorithmRequestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatBadgeModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    FlexLayoutModule,
    MatTableModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatTreeModule,
    MaterialModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes, faQuestionCircle);
  }
}
