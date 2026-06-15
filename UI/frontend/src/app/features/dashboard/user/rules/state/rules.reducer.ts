import { createReducer } from "@ngrx/store";
import { initialRuleState } from "./rules.state";

export const rulesReducer = createReducer(
  initialRuleState
);