import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../layout/components/app-header/app-header';
import { AppFooter } from '../../../layout/components/app-footer/app-footer';
import { AppSidebar } from '../../../layout/components/app-sidebar/app-sidebar';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, AppHeader, AppFooter, AppSidebar],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {

}
