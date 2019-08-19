import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails: User;
  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userDetails = this.userService.getUserinfo();
    if (this.userDetails == null) {
      this.router.navigateByUrl('/userprofile');
    }
    // this.userService.getUserProfile().subscribe(
    //   res => {
    //     this.userDetails = res['user'];
    //   },
    //   err => {
    console.log(this.userDetails);
    //   }
    // );
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  loginAsRoleLL(role) {
    this.userService.setRole(role);
    this.router.navigate(['/dashboard-LLtags']);
  }

}
