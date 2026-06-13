import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../layout/components/header/header';
import { Footer } from '../../../layout/components/footer/footer';
import { Sidebar } from '../../../layout/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {

}
