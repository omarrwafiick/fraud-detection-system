export interface TableColumn {
  key: string;
  header: string;
  isMono?: boolean;
}

export interface TableFilterEvent {
  searchQuery: string;
  currentPage: number;
}