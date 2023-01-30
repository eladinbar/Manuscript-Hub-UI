import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
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
import {ReactiveFormsModule} from "@angular/forms";
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
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSortModule} from "@angular/material/sort";
import {DocumentDetailsComponent} from './pages/document-details/document-details.component';
import {LoginComponent} from './account/login/login.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {HttpErrorInterceptorService} from "./interceptors/http-error-interceptor.interceptor";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    DocumentDetailsComponent,
    LoginComponent,
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
}
