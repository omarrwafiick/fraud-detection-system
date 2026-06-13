import { Component } from '@angular/core';
import { Header } from '../../layout/components/header/header';
import { Footer } from '../../layout/components/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [Header, Footer],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage {

}
