import { createReducer } from "@ngrx/store";
import { initialAnalysisState } from "./analytics.state";

export const analysisReducer = createReducer(
  initialAnalysisState
);