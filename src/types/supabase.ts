export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bills: {
        Row: {
          id: string
          name: string
          amount: number
          due_date: string
          status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'
          category: string
          is_recurring: boolean
          paid_amount: number | null
          recurring_day: number | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          due_date: string
          status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'
          category: string
          is_recurring?: boolean
          paid_amount?: number | null
          recurring_day?: number | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          due_date?: string
          status?: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'
          category?: string
          is_recurring?: boolean
          paid_amount?: number | null
          recurring_day?: number | null
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}