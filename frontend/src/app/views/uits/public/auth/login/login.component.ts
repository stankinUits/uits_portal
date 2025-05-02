import {Component, OnInit} from '@angular/core';
import {LoginForm} from '@app/shared/types/models/forms';
import {AuthService} from '@app/shared/services/auth.service';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';
import {error} from "protractor";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hasError = false;

  constructor(private authService: AuthService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  login(data: LoginForm) {
    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigateByUrl(PagesConfig.home);
      },
      error: () => {
        this.hasError = true;
      }
    });
  }
}
