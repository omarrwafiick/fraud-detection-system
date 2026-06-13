import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Case } from './cases.state';

export const CasesActions = createActionGroup({
  source: 'Cases Management API',
  events: {
    'Load Cases': emptyProps(),
    'Load Cases Success': props<{ cases: Case[] }>(),
    'Load Cases Failure': props<{ error: string }>(),
    'Select Case': props<{ caseId: string }>()
  }
});