import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard';
import { RcTagsComponent } from './rc-tags/rc-tags.component';
import { RcTagComponent } from './rc-tags/rc-tag/rc-tag.component';
// import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RcCatsComponent } from './rc-cats/rc-cats.component';
import { RcCatComponent } from './rc-cats/rc-cat/rc-cat.component';
import { RcFormatsComponent } from './rc-formats/rc-formats.component';
import { RcFormatComponent } from './rc-formats/rc-format/rc-format.component';
import { RcResourcesComponent } from './rc-resources/rc-resources.component';
import { RcResourceComponent } from './rc-resources/rc-resource/rc-resource.component';
import { RcResourceTopicsComponent } from './rc-resources/rc-resource-topics/rc-resource-topics.component';
import { DashboardLLTagsComponent } from './dashboard-lltags/dashboard-lltags.component';
import { DashboardLLFormatsComponent } from './dashboard-llformats/dashboard-llformats.component';
import { DashboardLLCatsComponent } from './dashboard-llcats/dashboard-llcats.component';
import { DashboardLLResourcesComponent } from './dashboard-llresources/dashboard-llresources.component';
import { ResourceContentModalComponent } from './dashboard-llresources/resource-content-modal/resource-content-modal.component';

export const appRoutes: Routes = [
  {
    path: 'signup', component: UserComponent,
    children: [{ path: '', component: SignUpComponent }]
  },
  {
    path: 'login', component: UserComponent,
    children: [{ path: '', component: SignInComponent }]
  },
  {
    path: 'userprofile', component: UserProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-tags', component: RcTagsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-tag', component: RcTagComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-cats', component: RcCatsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-cat', component: RcCatComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-formats', component: RcFormatsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-format', component: RcFormatComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-resources', component: RcResourcesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-resource', component: RcResourceComponent, canActivate: [AuthGuard]
  },
  {
    path: 'rc-resource-topics', component: RcResourceTopicsComponent, canActivate: [AuthGuard]
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  }
  , { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
  , { path: 'dashboard-LLtags', component: DashboardLLTagsComponent, canActivate: [AuthGuard] }
  , { path: 'dashboard-LLformats/:tagid', component: DashboardLLFormatsComponent, canActivate: [AuthGuard] }
  , { path: 'dashboard-LLcats/:tagid/:formatid', component: DashboardLLCatsComponent, canActivate: [AuthGuard] }
  // tslint:disable-next-line: max-line-length
  , { path: 'dashboard-llresources/:tagid/:formatid/:catid/:topicid/:position', component: DashboardLLResourcesComponent, canActivate: [AuthGuard] }
  // , { path: 'dashboard-llsession-special', component: DashboardLLSessionSpecialComponent, canActivate: [AuthGuard] }
  // , { path: 'dashboard-llsession-homework', component: DashboardLLSessionHomeworkComponent, canActivate: [AuthGuard] }
  , { path: 'resource-content-modal', component: ResourceContentModalComponent, canActivate: [AuthGuard] }
];
