export interface Borrower {
  name: string;
  book: string;
}

export interface Admin {
  name: string;
  id: string;
  status: string;
}

export interface Branch {
  name: string;
  id: string;
}

export interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedRatio: number;
  returnedRatio: number;
  borrowers: Borrower[];
  admins: Admin[];
  branches: Branch[];
}
