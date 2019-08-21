import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { UserService } from './shared/user.service';
import { appRoutes } from './routes';
import { DatePipe } from '@angular/common';
import { RcTagsComponent } from './rc-tags/rc-tags.component';
import { RcTagComponent } from './rc-tags/rc-tag/rc-tag.component';
import { RcTagListComponent } from './rc-tags/rc-tag-list/rc-tag-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RcFormatsComponent } from './rc-formats/rc-formats.component';
import { RcFormatListComponent } from './rc-formats/rc-format-list/rc-format-list.component';
import { RcFormatComponent } from './rc-formats/rc-format/rc-format.component';
import { RcCatsComponent } from './rc-cats/rc-cats.component';
import { RcCatComponent } from './rc-cats/rc-cat/rc-cat.component';
import { RcCatListComponent } from './rc-cats/rc-cat-list/rc-cat-list.component';
import { RcResourcesComponent } from './rc-resources/rc-resources.component';
import { RcResourceListComponent } from './rc-resources/rc-resource-list/rc-resource-list.component';
import { RcResourceComponent } from './rc-resources/rc-resource/rc-resource.component';
// import { MatFileUploadModule } from 'angular-material-fileupload';
// import { MatFileUploadModule } from 'mat-file-upload';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RcResourceTopicsComponent } from './rc-resources/rc-resource-topics/rc-resource-topics.component';
import { DashboardLLTagsComponent } from './dashboard-lltags/dashboard-lltags.component';
import { DashboardLLFormatsComponent } from './dashboard-llformats/dashboard-llformats.component';
import { DashboardLLCatsComponent } from './dashboard-llcats/dashboard-llcats.component';
import { DashboardLLResourcesComponent } from './dashboard-llresources/dashboard-llresources.component';
import { ResourceListComponent } from './dashboard-llresources/resource-list/resource-list.component';
import { ResourceContentModalComponent } from './dashboard-llresources/resource-content-modal/resource-content-modal.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    RcTagsComponent,
    RcTagComponent,
    RcTagListComponent,
    DashboardComponent,
    RcFormatsComponent,
    RcFormatListComponent,
    RcFormatComponent,
    RcCatsComponent,
    RcCatComponent,
    RcCatListComponent,
    RcResourcesComponent,
    RcResourceListComponent,
    RcResourceComponent,
    RcResourceTopicsComponent,
    DashboardLLTagsComponent,
    DashboardLLFormatsComponent,
    DashboardLLCatsComponent,
    DashboardLLResourcesComponent,
    ResourceListComponent,
    ResourceContentModalComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    EditorModule,
    BarRatingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    UserService,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
