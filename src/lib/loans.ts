import { addDays } from './dates.ts'
import type { Loan, LoanStatus, StatusFilter } from './types.ts'

export function statusOf(loan: Loan, today: string): LoanStatus {
  if (loan.actualReturnDate !== null) return 'Returned'
  return loan.expectedReturnDate < today ? 'Overdue' : 'Borrowed'
}

/** Sample loans from one_page.md, relative to today's Lagos date. */
export function buildSampleLoans(today: string): Loan[] {
  const borrowed = (n: number): string => addDays(today, n)
  const created = (borrowedDate: string, i: number): number =>
    Date.parse(`${borrowedDate}T12:00:00Z`) + i
  return [
    {
      id: 'loan-1',
      toolName: 'Angle Grinder 1',
      borrowerName: 'Sample Borrower A',
      phone: '00000000001',
      borrowedDate: borrowed(-2),
      expectedReturnDate: addDays(today, 3),
      actualReturnDate: null,
      createdAt: created(borrowed(-2), 1),
    },
    {
      id: 'loan-2',
      toolName: 'Cordless Drill 1',
      borrowerName: 'Sample Borrower B',
      phone: '00000000002',
      borrowedDate: borrowed(-1),
      expectedReturnDate: today,
      actualReturnDate: null,
      createdAt: created(borrowed(-1), 2),
    },
    {
      id: 'loan-3',
      toolName: 'Circular Saw 1',
      borrowerName: 'Sample Borrower C',
      phone: '00000000003',
      borrowedDate: borrowed(-5),
      expectedReturnDate: addDays(today, -1),
      actualReturnDate: null,
      createdAt: created(borrowed(-5), 3),
    },
    {
      id: 'loan-4',
      toolName: 'Electric Sander 1',
      borrowerName: 'Sample Borrower D',
      phone: '00000000004',
      borrowedDate: borrowed(-7),
      expectedReturnDate: addDays(today, -2),
      actualReturnDate: addDays(today, -3),
      createdAt: created(borrowed(-7), 4),
    },
  ]
}

function byId(a: Loan, b: Loan): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

export function sortOutstanding(loans: Loan[]): Loan[] {
  return [...loans].sort(
    (a, b) =>
      (a.expectedReturnDate < b.expectedReturnDate
        ? -1
        : a.expectedReturnDate > b.expectedReturnDate
          ? 1
          : 0) ||
      b.createdAt - a.createdAt ||
      byId(a, b),
  )
}

export function sortReturned(loans: Loan[]): Loan[] {
  return [...loans].sort(
    (a, b) =>
      ((b.actualReturnDate ?? '') < (a.actualReturnDate ?? '')
        ? -1
        : (b.actualReturnDate ?? '') > (a.actualReturnDate ?? '')
          ? 1
          : 0) ||
      b.createdAt - a.createdAt ||
      byId(a, b),
  )
}

export function filterLoans(
  loans: Loan[],
  status: StatusFilter,
  date: string,
  today: string,
): Loan[] {
  const matchesDate = (loan: Loan): boolean =>
    date === '' || loan.expectedReturnDate === date
  if (status === 'returned') {
    return sortReturned(
      loans.filter(
        (l) => l.actualReturnDate !== null && matchesDate(l),
      ),
    )
  }
  const unreturned = loans.filter((l) => l.actualReturnDate === null)
  const wanted =
    status === 'borrowed'
      ? unreturned.filter((l) => statusOf(l, today) === 'Borrowed')
      : status === 'overdue'
        ? unreturned.filter((l) => statusOf(l, today) === 'Overdue')
        : unreturned
  return sortOutstanding(wanted.filter(matchesDate))
}

/** Dev fixtures for reviewing error states (not product screens). */
export function getFixture(): string | null {
  const m = window.location.hash.match(/fixture=([a-z-]+)/)
  return m ? m[1] : null
}

export function clearFixture(): void {
  window.location.hash = ''
}
