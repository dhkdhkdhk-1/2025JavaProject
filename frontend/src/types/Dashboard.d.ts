export interface Borrower {
  name: string;
  book: string;
  id: string;
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
  borrowedCount: number;
  returnedCount: number;
  borrowers: Borrower[];
  admins: Admin[];
  branches: Branch[];
  books: Book[];
}
