import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CasesState } from './cases.state';

export const selectCasesFeature = createFeatureSelector<CasesState>('casesFeature');

export const selectAllCases = createSelector(
  selectCasesFeature,
  (state) => state.items
);

export const selectCasesLoading = createSelector(
  selectCasesFeature,
  (state) => state.loading
);

export const selectActiveCaseId = createSelector(
  selectCasesFeature,
  (state) => state.activeCaseId
);

export const selectCurrentCase = createSelector(
  selectAllCases,
  selectActiveCaseId,
  (items, activeId) => items.find(item => item.id === activeId) || null
);