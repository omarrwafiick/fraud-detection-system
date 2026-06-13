import { Component } from '@angular/core';
import { AppHeader } from '../../layout/components/app-header/app-header';
import { AppFooter } from '../../layout/components/app-footer/app-footer';

@Component({
  selector: 'app-landing-page',
  imports: [AppHeader, AppFooter],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage {
}
