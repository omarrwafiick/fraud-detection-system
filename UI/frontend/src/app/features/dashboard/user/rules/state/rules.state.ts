export interface Rule {
}

export interface RuleState {
  rules: Rule[];
  loading: boolean;
  error: string | null;
}

export const initialRuleState: RuleState = {
  rules: [],
  loading: false,
  error: null
};