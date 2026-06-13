import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class CasesEffects {
//   fetchData$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(),
//       exhaustMap(() =>
//         this.dataService.getData().pipe(
//           map((data) => DataActions.loadDataSuccess({ data })),
//           catchError((error) => of())
//         )
//       )
//     )
//   );
  constructor(private actions$: Actions) {}
}
