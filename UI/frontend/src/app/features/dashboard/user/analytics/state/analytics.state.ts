export interface Case {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
}

export interface CasesState {
  items: Case[];
  activeCaseId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialCasesState: CasesState = {
  items: [],
  activeCaseId: null,
  loading: false,
  error: null
};