export interface LaundryService {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  turnaroundHours: number;
}

export interface SummaryReport {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  averagePrice: number;
  mostExpensive: LaundryService | null;
  cheapest: LaundryService | null;
}

export interface FinalReport {
  generatedAt: string;
  appliedFilter: string | null;
  summary: SummaryReport;
  items: LaundryService[];
}