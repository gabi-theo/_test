import { 
  Journal, 
  BondAccrual, 
  Instrument, 
  Partner, 
  PartnerType, 
  Portfolio, 
  Operation, 
  AccountMapping, 
  Deposit, 
  ErrorLog, 
  PaginatedResponse,
  AIAgent,
  AIModel,
  HedgeFundResult
} from '../types'

// Mock data generators
const generateMockJournals = (count: number = 50): Journal[] => {
  const journals: Journal[] = []
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA']
  const operations = ['BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER']
  
  for (let i = 1; i <= count; i++) {
    journals.push({
      id: i,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      transactionid: `TXN${String(i).padStart(6, '0')}`,
      ubo_code: `UBO${Math.floor(Math.random() * 5) + 1}`,
      custodian_code: `CUST${Math.floor(Math.random() * 3) + 1}`,
      account_code: `ACC${Math.floor(Math.random() * 10) + 1}`,
      operation_code: operations[Math.floor(Math.random() * operations.length)],
      partner_code: `PART${Math.floor(Math.random() * 20) + 1}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      currency_code: Math.random() > 0.7 ? 'EUR' : 'USD',
      quantity: Math.floor(Math.random() * 1000) + 1,
      details: `Transaction details for ${symbols[Math.floor(Math.random() * symbols.length)]}`,
      value_abs: Math.random() * 100000,
      value_ron_abs: Math.random() * 500000,
      bnr: 4.5 + Math.random() * 0.5,
      storno: Math.random() > 0.9,
      lock: Math.random() > 0.8,
      debit_analitic: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}`,
      credit_analitic: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}`,
    })
  }
  
  return journals
}

const generateMockBondAccruals = (count: number = 30): BondAccrual[] => {
  const accruals: BondAccrual[] = []
  const instruments = ['BOND001', 'BOND002', 'BOND003', 'BOND004', 'BOND005']
  
  for (let i = 1; i <= count; i++) {
    accruals.push({
      id: i,
      ubo: `UBO${Math.floor(Math.random() * 5) + 1}`,
      custodian: `CUST${Math.floor(Math.random() * 3) + 1}`,
      partner: `PART${Math.floor(Math.random() * 20) + 1}`,
      account: `ACC${Math.floor(Math.random() * 10) + 1}`,
      instrument: instruments[Math.floor(Math.random() * instruments.length)],
      currency: Math.random() > 0.5 ? 'EUR' : 'USD',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      operation: 'ACCRUAL',
      details: 'Bond accrual calculation',
      priority: Math.floor(Math.random() * 5) + 1,
      quantity: Math.random() * 1000000,
      quantity_total: Math.random() * 5000000,
      value: Math.random() * 100000,
      accruals_total: Math.random() * 50000,
      accrual: Math.random() * 1000,
      accrual_valuta: Math.random() * 1000,
      accrual_ron: Math.random() * 5000,
      total_accrual_valuta: Math.random() * 10000,
      total_accrual_ron: Math.random() * 50000,
      revalue_total: Math.random() * 5000,
      total_fx_diff: Math.random() * 1000,
      fx_diff: Math.random() * 100,
      bnr: 4.5 + Math.random() * 0.5,
      bnr_eom: 4.6 + Math.random() * 0.5,
      coupon_settled: Math.random() * 1000,
      accrual_settled: Math.random() * 500,
      accrual_incremental: Math.random() * 100,
    })
  }
  
  return accruals
}

const generateMockInstruments = (count: number = 40): Instrument[] => {
  const instruments: Instrument[] = []
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'BOND001', 'BOND002', 'BOND003']
  const types = ['STOCK', 'BOND', 'ETF', 'OPTION']
  const sectors = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer']
  const countries = ['US', 'DE', 'FR', 'UK', 'JP']
  
  for (let i = 1; i <= count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    instruments.push({
      id: i,
      symbol: `${symbol}${i}`,
      isin: `US${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}${Math.floor(Math.random() * 10)}`,
      custodian: Math.floor(Math.random() * 3) + 1,
      custodian_name: `Custodian ${Math.floor(Math.random() * 3) + 1}`,
      currency: Math.floor(Math.random() * 3) + 1,
      currency_name: Math.random() > 0.5 ? 'USD' : 'EUR',
      name: `${symbol} Corporation`,
      type: types[Math.floor(Math.random() * types.length)],
      principal: Math.random() > 0.5 ? Math.random() * 1000000 : undefined,
      face_value: Math.random() > 0.5 ? 100 : undefined,
      interest: Math.random() > 0.5 ? Math.random() * 10 : undefined,
      depo_start: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      bond_issue: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      bond_first_coupon: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      maturity: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      convention: Math.random() > 0.5 ? '30/360' : 'ACT/ACT',
      calendar: 'TARGET',
      bond_coupon_count: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : undefined,
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      needs_to_be_checked: Math.random() > 0.8,
    })
  }
  
  return instruments
}

const generateMockPartners = (count: number = 25): Partner[] => {
  const partners: Partner[] = []
  const types = ['BROKER', 'BANK', 'CUSTODIAN', 'EXCHANGE', 'CLEARINGHOUSE']
  
  for (let i = 1; i <= count; i++) {
    partners.push({
      id: i,
      partner_code: `PART${String(i).padStart(3, '0')}`,
      partner_type: Math.floor(Math.random() * 5) + 1,
      partner_type_code: types[Math.floor(Math.random() * types.length)],
      journal_code: `JRN${Math.floor(Math.random() * 100) + 1}`,
      partner_name: `Partner ${i} Ltd.`,
    })
  }
  
  return partners
}

const generateMockPartnerTypes = (): PartnerType[] => {
  return [
    { id: 1, partner_type_code: 'BROKER', journal_code: 'JRN001' },
    { id: 2, partner_type_code: 'BANK', journal_code: 'JRN002' },
    { id: 3, partner_type_code: 'CUSTODIAN', journal_code: 'JRN003' },
    { id: 4, partner_type_code: 'EXCHANGE', journal_code: 'JRN004' },
    { id: 5, partner_type_code: 'CLEARINGHOUSE', journal_code: 'JRN005' },
  ]
}

const generateMockPortfolios = (count: number = 20): Portfolio[] => {
  const portfolios: Portfolio[] = []
  const instruments = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']
  
  for (let i = 1; i <= count; i++) {
    portfolios.push({
      id: i,
      ubo_code: `UBO${Math.floor(Math.random() * 5) + 1}`,
      instrument_name: instruments[Math.floor(Math.random() * instruments.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cost: Math.random() * 100000,
      value: Math.random() * 120000,
      quantity: Math.random() * 1000,
      accruedint: Math.random() * 1000,
    })
  }
  
  return portfolios
}

const generateMockOperations = (count: number = 15): Operation[] => {
  const operations: Operation[] = []
  const codes = ['BUY', 'SELL', 'DIV', 'INT', 'FEE', 'TAX', 'SPLIT', 'MERGE']
  
  for (let i = 1; i <= count; i++) {
    operations.push({
      id: i,
      operation_code: codes[Math.floor(Math.random() * codes.length)],
      operation_name: `Operation ${i}`,
      debit: Math.floor(Math.random() * 10) + 1,
      credit: Math.floor(Math.random() * 10) + 1,
      debit_display: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1} - Account Name`,
      credit_display: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1} - Account Name`,
    })
  }
  
  return operations
}

const generateMockAccountMappings = (count: number = 10): AccountMapping[] => {
  const mappings: AccountMapping[] = []
  
  for (let i = 1; i <= count; i++) {
    mappings.push({
      id: i,
      account_saga: Math.random() > 0.3 ? `SAGA${String(i).padStart(3, '0')}` : undefined,
      main_account: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}`,
    })
  }
  
  return mappings
}

const generateMockDeposits = (count: number = 12): Deposit[] => {
  const deposits: Deposit[] = []
  
  for (let i = 1; i <= count; i++) {
    const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const maturityDate = new Date(startDate.getTime() + (Math.random() * 365 + 30) * 24 * 60 * 60 * 1000)
    
    deposits.push({
      id: i,
      deposit: `DEP${String(i).padStart(3, '0')}`,
      principal: Math.random() * 1000000,
      interest_rate: Math.random() * 5 + 1,
      start: startDate.toISOString().split('T')[0],
      maturity: maturityDate.toISOString().split('T')[0],
      details: `Deposit ${i} details`,
    })
  }
  
  return deposits
}

const generateMockErrors = (count: number = 8): ErrorLog[] => {
  const errors: ErrorLog[] = []
  const loggers = ['django.request', 'portfolio.views', 'auth.middleware', 'journals.api', 'instruments.service']
  const levels = ['ERROR', 'WARNING', 'INFO', 'DEBUG']
  const messages = [
    'Internal Server Error: /api/journals/',
    'Invalid portfolio data received',
    'User authentication successful',
    'Database connection timeout',
    'Invalid instrument symbol provided',
    'Rate limit exceeded for user',
    'Cache miss for portfolio data',
    'Successful data export completed'
  ]
  
  for (let i = 1; i <= count; i++) {
    errors.push({
      id: i,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      logger_name: loggers[Math.floor(Math.random() * loggers.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      trace: Math.random() > 0.5 ? 'Traceback (most recent call last):\n  File "views.py", line 42, in get\n    raise Exception("Test error")' : undefined,
      viewed: Math.random() > 0.4,
    })
  }
  
  return errors
}

// Mock data storage
let mockJournals = generateMockJournals()
let mockBondAccruals = generateMockBondAccruals()
let mockInstruments = generateMockInstruments()
let mockPartners = generateMockPartners()
let mockPartnerTypes = generateMockPartnerTypes()
let mockPortfolios = generateMockPortfolios()
let mockOperations = generateMockOperations()
let mockAccountMappings = generateMockAccountMappings()
let mockDeposits = generateMockDeposits()
let mockErrors = generateMockErrors()

// Utility function to paginate results
function paginate<T>(data: T[], page: number = 1, pageSize: number = 10): PaginatedResponse<T> {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const results = data.slice(startIndex, endIndex)
  
  return {
    count: data.length,
    next: endIndex < data.length ? `?page=${page + 1}` : undefined,
    previous: page > 1 ? `?page=${page - 1}` : undefined,
    results,
  }
}

// Utility function to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API service
export const mockApi = {
  // Auth endpoints
  auth: {
    login: async (username: string, password: string) => {
      await delay()
      if (username === 'admin' && password === 'admin') {
        return {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
        }
      }
      throw new Error('Invalid credentials')
    },
    
    getUser: async () => {
      await delay()
      return {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
      }
    },
  },

  // Journals endpoints
  journals: {
    list: async (params?: { page?: number; search?: string; ordering?: string; date_after?: string; date_before?: string }) => {
      await delay()
      let filteredJournals = [...mockJournals]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        filteredJournals = filteredJournals.filter(journal =>
          journal.symbol.toLowerCase().includes(search) ||
          journal.transactionid.toLowerCase().includes(search) ||
          journal.details.toLowerCase().includes(search)
        )
      }
      
      if (params?.date_after) {
        filteredJournals = filteredJournals.filter(journal => journal.date >= params.date_after!)
      }
      
      if (params?.date_before) {
        filteredJournals = filteredJournals.filter(journal => journal.date <= params.date_before!)
      }
      
      if (params?.ordering) {
        const [direction, field] = params.ordering.startsWith('-') 
          ? ['desc', params.ordering.slice(1)] 
          : ['asc', params.ordering]
        
        filteredJournals.sort((a, b) => {
          const aVal = (a as any)[field]
          const bVal = (b as any)[field]
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          return direction === 'desc' ? -comparison : comparison
        })
      }
      
      return paginate(filteredJournals, params?.page)
    },
    
    create: async (data: Partial<Journal>) => {
      await delay()
      const newJournal: Journal = {
        id: Math.max(...mockJournals.map(j => j.id)) + 1,
        date: data.date || new Date().toISOString().split('T')[0],
        transactionid: data.transactionid || `TXN${Date.now()}`,
        ubo_code: data.ubo_code || 'UBO1',
        custodian_code: data.custodian_code || 'CUST1',
        account_code: data.account_code || 'ACC1',
        operation_code: data.operation_code || 'BUY',
        partner_code: data.partner_code || 'PART1',
        symbol: data.symbol || 'AAPL',
        currency_code: data.currency_code || 'USD',
        quantity: data.quantity || 0,
        details: data.details || '',
        value_abs: data.value_abs || 0,
        value_ron_abs: data.value_ron_abs || 0,
        bnr: data.bnr || 4.5,
        storno: data.storno || false,
        lock: data.lock || false,
        debit_analitic: data.debit_analitic || '123',
        credit_analitic: data.credit_analitic || '456',
      }
      mockJournals.unshift(newJournal)
      return newJournal
    },
    
    update: async (id: number, data: Partial<Journal>) => {
      await delay()
      const index = mockJournals.findIndex(j => j.id === id)
      if (index === -1) throw new Error('Journal not found')
      
      mockJournals[index] = { ...mockJournals[index], ...data }
      return mockJournals[index]
    },
    
    delete: async (id: number) => {
      await delay()
      const index = mockJournals.findIndex(j => j.id === id)
      if (index === -1) throw new Error('Journal not found')
      
      mockJournals.splice(index, 1)
    },
  },

  // Bond Accruals endpoints
  bondAccruals: {
    list: async (params?: { page?: number; search?: string }) => {
      await delay()
      let filteredAccruals = [...mockBondAccruals]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        filteredAccruals = filteredAccruals.filter(accrual =>
          accrual.instrument.toLowerCase().includes(search) ||
          accrual.ubo.toLowerCase().includes(search)
        )
      }
      
      return paginate(filteredAccruals, params?.page)
    },
    
    generate: async () => {
      await delay(2000) // Simulate longer processing time
      return { message: 'Accruals generated successfully', errors: [] }
    },
    
    delete: async (id: number) => {
      await delay()
      const index = mockBondAccruals.findIndex(a => a.id === id)
      if (index === -1) throw new Error('Bond accrual not found')
      
      mockBondAccruals.splice(index, 1)
    },
  },

  // Instruments endpoints
  instruments: {
    list: async (params?: { page?: number; search?: string; custodian?: string; currency?: string }) => {
      await delay()
      let filteredInstruments = [...mockInstruments]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        filteredInstruments = filteredInstruments.filter(instrument =>
          instrument.symbol.toLowerCase().includes(search) ||
          instrument.isin.toLowerCase().includes(search) ||
          instrument.name?.toLowerCase().includes(search)
        )
      }
      
      if (params?.custodian) {
        filteredInstruments = filteredInstruments.filter(instrument => 
          instrument.custodian.toString() === params.custodian
        )
      }
      
      if (params?.currency) {
        filteredInstruments = filteredInstruments.filter(instrument => 
          instrument.currency.toString() === params.currency
        )
      }
      
      return paginate(filteredInstruments, params?.page)
    },
    
    create: async (data: Partial<Instrument>) => {
      await delay()
      const newInstrument: Instrument = {
        id: Math.max(...mockInstruments.map(i => i.id)) + 1,
        symbol: data.symbol || 'NEW',
        isin: data.isin || 'US000000000',
        custodian: data.custodian || 1,
        custodian_name: 'Custodian 1',
        currency: data.currency || 1,
        currency_name: 'USD',
        name: data.name,
        type: data.type,
        principal: data.principal,
        face_value: data.face_value,
        interest: data.interest,
        depo_start: data.depo_start,
        bond_issue: data.bond_issue,
        bond_first_coupon: data.bond_first_coupon,
        maturity: data.maturity,
        convention: data.convention,
        calendar: data.calendar,
        bond_coupon_count: data.bond_coupon_count,
        sector: data.sector,
        country: data.country,
        needs_to_be_checked: data.needs_to_be_checked || false,
      }
      mockInstruments.unshift(newInstrument)
      return newInstrument
    },
    
    update: async (id: number, data: Partial<Instrument>) => {
      await delay()
      const index = mockInstruments.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Instrument not found')
      
      mockInstruments[index] = { ...mockInstruments[index], ...data }
      return mockInstruments[index]
    },
    
    delete: async (id: number) => {
      await delay()
      const index = mockInstruments.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Instrument not found')
      
      mockInstruments.splice(index, 1)
    },
  },

  // AI Hedge Fund endpoints
  aiHedgeFund: {
    getAgents: async (): Promise<{ agents: AIAgent[] }> => {
      await delay()
      return {
        agents: [
          {
            key: 'technical_analyst',
            display_name: 'Technical Analyst',
            description: 'Analyzes price patterns and technical indicators'
          },
          {
            key: 'fundamental_analyst',
            display_name: 'Fundamental Analyst',
            description: 'Evaluates company financials and market conditions'
          },
          {
            key: 'sentiment_analyst',
            display_name: 'Sentiment Analyst',
            description: 'Analyzes market sentiment and news'
          },
          {
            key: 'risk_manager',
            display_name: 'Risk Manager',
            description: 'Manages portfolio risk and position sizing'
          }
        ]
      }
    },
    
    getModels: async (): Promise<{ models: AIModel[] }> => {
      await delay()
      return {
        models: [
          { name: 'gpt-4o', provider: 'OpenAI', display_name: 'GPT 4o' },
          { name: 'gpt-4', provider: 'OpenAI', display_name: 'GPT 4' },
          { name: 'gpt-3.5-turbo', provider: 'OpenAI', display_name: 'GPT 3.5 Turbo' },
          { name: 'claude-3-5-haiku-latest', provider: 'Anthropic', display_name: 'Claude Haiku 3.5' },
          { name: 'claude-sonnet-4-20250514', provider: 'Anthropic', display_name: 'Claude Sonnet 4' },
          { name: 'meta-llama/llama-4-scout-17b-16e-instruct', provider: 'Groq', display_name: 'Llama 4 Scout (17b)' },
          { name: 'meta-llama/llama-4-maverick-17b-128e-instruct', provider: 'Groq', display_name: 'Llama 4 Maverick (17b)' }
        ]
      }
    },
    
    runAnalysis: async function* (config: any) {
      await delay(1000)
      
      // Start event
      yield {
        type: 'start',
        message: 'Analysis started'
      }
      
      // Progress events
      const tickers = config.tickers || ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
      const agents = config.selected_agents || ['technical_analyst', 'fundamental_analyst', 'sentiment_analyst']
      
      for (const agent of agents) {
        for (const ticker of tickers) {
          await delay(800)
          yield {
            type: 'progress',
            agent: agent.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            ticker,
            status: 'Analyzing market data...',
            analysis: `Completed analysis for ${ticker}`,
            timestamp: new Date().toISOString()
          }
        }
      }
      
      await delay(1000)
      
      // Complete event with results
      const mockResults: HedgeFundResult = {
        decisions: {
          AAPL: { action: 'BUY', quantity: 50, reasoning: 'Strong technical indicators and positive sentiment' },
          GOOGL: { action: 'HOLD', quantity: 0, reasoning: 'Mixed signals, waiting for clearer trend' },
          MSFT: { action: 'BUY', quantity: 30, reasoning: 'Solid fundamentals and growth prospects' },
          TSLA: { action: 'SELL', quantity: 20, reasoning: 'Overvalued based on current metrics' }
        },
        analyst_signals: {
          'Technical Analyst': {
            AAPL: { signal: 'BULLISH', confidence: 85 },
            GOOGL: { signal: 'NEUTRAL', confidence: 60 },
            MSFT: { signal: 'BULLISH', confidence: 78 },
            TSLA: { signal: 'BEARISH', confidence: 72 }
          },
          'Fundamental Analyst': {
            AAPL: { signal: 'BULLISH', confidence: 80 },
            GOOGL: { signal: 'NEUTRAL', confidence: 65 },
            MSFT: { signal: 'BULLISH', confidence: 88 },
            TSLA: { signal: 'BEARISH', confidence: 75 }
          },
          'Sentiment Analyst': {
            AAPL: { signal: 'BULLISH', confidence: 70 },
            GOOGL: { signal: 'NEUTRAL', confidence: 55 },
            MSFT: { signal: 'BULLISH', confidence: 82 },
            TSLA: { signal: 'BEARISH', confidence: 68 }
          }
        }
      }
      
      yield {
        type: 'complete',
        data: mockResults
      }
    }
  },

  // Add other endpoints as needed...
  partners: {
    list: async () => {
      await delay()
      return { results: mockPartners }
    }
  },
  
  partnerTypes: {
    list: async () => {
      await delay()
      return { results: mockPartnerTypes }
    }
  },
  
  portfolios: {
    list: async (params?: { page?: number }) => {
      await delay()
      return paginate(mockPortfolios, params?.page)
    }
  },
  
  operations: {
    list: async (params?: { page?: number }) => {
      await delay()
      return paginate(mockOperations, params?.page)
    }
  },
  
  accountMappings: {
    list: async () => {
      await delay()
      return mockAccountMappings
    }
  },
  
  deposits: {
    list: async (params?: { page?: number }) => {
      await delay()
      return paginate(mockDeposits, params?.page)
    }
  },
  
  errors: {
    list: async (params?: { page?: number }) => {
      await delay()
      return paginate(mockErrors, params?.page)
    }
  }
}