export interface Analysis {
}

export interface AnalysisState {
  analysis: Partial<Analysis>;
  loading: boolean;
  error: string | null;
}

export const initialAnalysisState: AnalysisState = {
  analysis: {},
  loading: false,
  error: null
};