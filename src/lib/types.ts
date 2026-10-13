export type LoanStatus = 'Borrowed' | 'Overdue' | 'Returned'

export type StatusFilter =
  | 'all-outstanding'
  | 'borrowed'
  | 'overdue'
  | 'returned'

export interface Loan {
  id: string
  toolName: string
  borrowerName: string
  phone: string
  borrowedDate: string
  expectedReturnDate: string
  actualReturnDate: string | null
  createdAt: number
}
