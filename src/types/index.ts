export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Journal {
  id: number
  date: string
  transactionid: string
  ubo_code: string
  custodian_code: string
  account_code: string
  operation_code: string
  partner_code: string
  symbol: string
  currency_code: string
  quantity: number
  details: string
  value_abs: number
  value_ron_abs: number
  bnr: number
  storno: boolean
  lock: boolean
  debit_analitic: string
  credit_analitic: string
}

export interface BondAccrual {
  id: number
  ubo: string
  custodian: string
  partner: string
  account: string
  instrument: string
  currency: string
  date: string
  operation: string
  details?: string
  priority: number
  quantity: number
  quantity_total: number
  value: number
  accruals_total: number
  accrual: number
  accrual_valuta: number
  accrual_ron: number
  total_accrual_valuta: number
  total_accrual_ron: number
  revalue_total: number
  total_fx_diff: number
  fx_diff: number
  bnr?: number
  bnr_eom?: number
  coupon_settled: number
  accrual_settled: number
  accrual_incremental: number
}

export interface Instrument {
  id: number
  symbol: string
  isin: string
  custodian: number
  custodian_name: string
  currency: number
  currency_name: string
  name?: string
  type?: string
  principal?: number
  face_value?: number
  interest?: number
  depo_start?: string
  bond_issue?: string
  bond_first_coupon?: string
  maturity?: string
  convention?: string
  calendar?: string
  bond_coupon_count?: number
  sector?: string
  country?: string
  needs_to_be_checked: boolean
}

export interface Partner {
  id: number
  partner_code: string
  partner_type: number
  partner_type_code: string
  journal_code: string
  partner_name: string
}

export interface PartnerType {
  id: number
  partner_type_code: string
  journal_code: string
}

export interface Portfolio {
  id: number
  ubo_code: string
  instrument_name: string
  date: string
  cost: number
  value: number
  quantity: number
  accruedint: number
}

export interface Operation {
  id: number
  operation_code: string
  operation_name: string
  debit: number
  credit: number
  debit_display?: string
  credit_display?: string
}

export interface AccountMapping {
  id: number
  account_saga?: string
  main_account: string
}

export interface Deposit {
  id: number
  deposit: string
  principal: number
  interest_rate: number
  start: string
  maturity: string
  details?: string
}

export interface ErrorLog {
  id: number
  created_at: string
  logger_name: string
  level: string
  message: string
  trace?: string
  viewed: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface AIAgent {
  key: string
  display_name: string
  description: string
}

export interface AIModel {
  name: string
  provider: string
  display_name: string
}

export interface HedgeFundConfig {
  tickers: string[]
  selected_agents: string[]
  agent_models: Array<{
    agent_id: string
    model_name: string
    model_provider: string
  }>
  start_date?: string
  end_date?: string
  model_name: string
  model_provider: string
  initial_cash: number
  margin_requirement: number
}

export interface HedgeFundResult {
  decisions: Record<string, {
    action: string
    quantity?: number
    reasoning?: string
  }>
  analyst_signals: Record<string, Record<string, {
    signal: string
    confidence?: number
  }>>
}