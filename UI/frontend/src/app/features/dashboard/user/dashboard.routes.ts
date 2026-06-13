import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { casesReducer } from './cases/state/cases.reducer';
import { CasesEffects } from './cases/state/cases.effects';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.page').then(m => m.DashboardPage),
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      {
        path: 'analytics',
        children: [
          { path: '', redirectTo: 'summary', pathMatch: 'full' },
          { 
            path: 'summary', 
            title: 'Analytics Summary', 
            loadComponent: () => import('./analytics/pages/summary/summary.page').then(m => m.SummaryPage) 
          },
          { 
            path: 'trends', 
            title: 'Fraud Trends Analysis', 
            loadComponent: () => import('./analytics/pages/fraud-trends-line-chart/fraud-trends-line-chart.page').then(m => m.FraudTrendsLineChartPage) 
          }
        ]
      },
      {
        path: 'cases',
        providers: [
          provideState({ name: 'casesFeature', reducer: casesReducer }),
          provideEffects(CasesEffects),
        ],
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { 
            path: 'list', 
            title: 'Case Management', 
            loadComponent: () => import('./cases/pages/cases-list/cases-list.page').then(m => m.CasesListPage) 
          },
          { 
            path: 'details/:id',
            title: 'Case Details', 
            loadComponent: () => import('./cases/pages/case-details/case-details.page').then(m => m.CaseDetailsPage) 
          },
          { 
            path: 'network', 
            title: 'Network Graph Visualizer', 
            loadComponent: () => import('./cases/pages/network-graph-visualizer/network-graph-visualizer.page').then(m => m.NetworkGraphVisualizerPage) 
          }
        ]
      },
      {
        path: 'rules',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { 
            path: 'list', 
            title: 'System Rules', 
            loadComponent: () => import('./rules/pages/rules-list/rules-list.page').then(m => m.RulesListPage) 
          },
          { 
            path: 'builder', 
            title: 'Rule Builder Engine', 
            loadComponent: () => import('./rules/pages/rule-builder/rule-builder.page').then(m => m.RuleBuilderPage) 
          }
        ]
      }
    ]
  }
];