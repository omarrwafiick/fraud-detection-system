import { createReducer, on } from '@ngrx/store';
import { initialCasesState } from './cases.state';
import { CasesActions } from './cases.actions';

export const casesReducer = createReducer(
  initialCasesState,
  on(CasesActions.loadCases, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CasesActions.loadCasesSuccess, (state, { cases }) => ({
    ...state,
    items: cases,
    loading: false
  })),
  on(CasesActions.loadCasesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CasesActions.selectCase, (state, { caseId }) => ({
    ...state,
    activeCaseId: caseId
  }))
);