import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Loan } from './types.ts'

export interface LoanRow {
  id: string
  tool_name: string | null
  borrower_name: string | null
  phone_number: string | null
  borrowing_date: string | null
  expected_return_date: string | null
  actual_return_date: string | null
  created_at: string | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseSettingsMessage: string | null =
  !supabaseUrl || !supabaseAnonKey
    ? 'ToolLedger is not connected yet. The Supabase settings are missing. Copy .env.example to .env, add your project URL and anon key, then restart the app.'
    : null

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export function mapRowToLoan(row: LoanRow): Loan {
  const createdAt =
    row.created_at != null ? Date.parse(row.created_at) : Number.NaN
  return {
    id: row.id,
    toolName: row.tool_name ?? '',
    borrowerName: row.borrower_name ?? '',
    phone: row.phone_number ?? '',
    borrowedDate: row.borrowing_date ?? '',
    expectedReturnDate: row.expected_return_date ?? '',
    actualReturnDate: row.actual_return_date,
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
  }
}

export async function fetchLoansFromSupabase(
  client: SupabaseClient,
): Promise<Loan[]> {
  const { data, error } = await client
    .from('loan_records')
    .select(
      'id, tool_name, borrower_name, phone_number, borrowing_date, expected_return_date, actual_return_date, created_at',
    )
  if (error) throw error
  return ((data ?? []) as LoanRow[]).map(mapRowToLoan)
}

const LOAN_COLUMNS =
  'id, tool_name, borrower_name, phone_number, borrowing_date, expected_return_date, actual_return_date, created_at'

export interface LoanWrite {
  toolName: string
  borrowerName: string
  phone: string
  expectedReturnDate: string
}

export async function insertLoanInSupabase(
  client: SupabaseClient,
  data: LoanWrite,
  borrowingDate: string,
): Promise<Loan> {
  const { data: row, error } = await client
    .from('loan_records')
    .insert({
      owner_id: null,
      tool_name: data.toolName,
      borrower_name: data.borrowerName,
      phone_number: data.phone,
      borrowing_date: borrowingDate,
      expected_return_date: data.expectedReturnDate,
      actual_return_date: null,
    })
    .select(LOAN_COLUMNS)
    .single()
  if (error) throw error
  return mapRowToLoan(row as LoanRow)
}

export async function updateLoanInSupabase(
  client: SupabaseClient,
  id: string,
  data: LoanWrite,
): Promise<Loan> {
  const { data: row, error } = await client
    .from('loan_records')
    .update({
      tool_name: data.toolName,
      borrower_name: data.borrowerName,
      phone_number: data.phone,
      expected_return_date: data.expectedReturnDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('actual_return_date', null)
    .select(LOAN_COLUMNS)
    .single()
  if (error) throw error
  return mapRowToLoan(row as LoanRow)
}

export async function markReturnedInSupabase(
  client: SupabaseClient,
  id: string,
  today: string,
): Promise<Loan> {
  const { data: row, error } = await client
    .from('loan_records')
    .update({
      actual_return_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('actual_return_date', null)
    .select(LOAN_COLUMNS)
    .single()
  if (error) throw error
  return mapRowToLoan(row as LoanRow)
}
