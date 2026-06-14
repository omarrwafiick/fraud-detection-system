import { Component } from '@angular/core';
import { AppHeader } from '../../layout/components/app-header/app-header';
import { AppFooter } from '../../layout/components/app-footer/app-footer';
import { LucideAngularModule, LucideIconData, Settings, Network, ShieldHalfIcon, ChartNoAxesCombinedIcon, SquareChartGantt, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-landing-page',
  imports: [AppHeader, AppFooter, LucideAngularModule],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage {
  SettingIconClass = Settings;
  NetworkIconClass = Network;
  ShieldIconClass = ShieldHalfIcon;
  ChartIconClass = ChartNoAxesCombinedIcon;
}
