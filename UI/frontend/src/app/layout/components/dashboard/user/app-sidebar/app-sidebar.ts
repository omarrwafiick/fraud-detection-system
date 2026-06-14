import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LucideIconData, Settings, CirclePile, Network, ShieldHalfIcon, ChartNoAxesCombinedIcon, SquareChartGantt, ChevronDown } from 'lucide-angular';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: LucideIconData }[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  private collapsedGroups = signal<Record<string, boolean>>({
    'Automation Engine': true,
    'Incident Resolution': true,
  });

  ChevronDownClass = ChevronDown;

  protected navigationStructure: NavGroup[] = [
    {
      label: 'Security Intelligence',
      items: [
        { path: '/dashboard/user/analytics/summary', label: 'Overview Metrics', icon: SquareChartGantt },
        { path: '/dashboard/user/analytics/trends', label: 'Anomalous Trends', icon: ChartNoAxesCombinedIcon }
      ]
    },
    {
      label: 'Incident Resolution',
      items: [
        { path: '/dashboard/user/cases/list', label: 'Incident Ledger', icon: ShieldHalfIcon },
        { path: '/dashboard/user/cases/network', label: 'Graph Topology', icon: Network }
      ]
    },
    {
      label: 'Automation Engine',
      items: [
        { path: '/dashboard/user/rules/list', label: 'Active Matrix', icon: Settings },
        { path: '/dashboard/user/rules/builder', label: 'Rule Orchestrator', icon: CirclePile }
      ]
    }
  ];

  protected toggleGroup(label: string): void {
    this.collapsedGroups.update((currentMap) => ({
      ...currentMap,
      [label]: !currentMap[label]
    }));
  }

  protected isGroupCollapsed(label: string): boolean {
    return !!this.collapsedGroups()[label];
  }
}
