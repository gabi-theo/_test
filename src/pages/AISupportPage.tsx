import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { CpuChipIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline'
import { apiService } from '../lib/api'
import { AIAgent, AIModel, HedgeFundResult } from '../types'
import { toast } from 'react-toastify'

interface ProgressUpdate {
  type: string
  agent?: string
  ticker?: string
  status?: string
  analysis?: string
  timestamp?: string
}

export function AISupportPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['technical_analyst', 'fundamental_analyst', 'sentiment_analyst'])
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([])
  const [results, setResults] = useState<HedgeFundResult | null>(null)
  const [formData, setFormData] = useState({
    tickers: 'AAPL,GOOGL,MSFT,TSLA',
    initialCash: '100000',
    startDate: '',
    endDate: '',
    modelProvider: 'OpenAI',
    modelName: 'gpt-4o'
  })

  useEffect(() => {
    loadAgents()
    loadModels()
    setDefaultDates()
  }, [])

  const setDefaultDates = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 90)

    setFormData(prev => ({
      ...prev,
      endDate: endDate.toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0]
    }))
  }

  const loadAgents = async () => {
    try {
      const data = await apiService.aiHedgeFund.getAgents()
      setAgents(data.agents)
    } catch (error) {
      console.error('Failed to load agents:', error)
      toast.error('Failed to load AI agents')
    }
  }

  const loadModels = async () => {
    try {
      const data = await apiService.aiHedgeFund.getModels()
      setModels(data.models)
    } catch (error) {
      console.error('Failed to load models:', error)
      toast.error('Failed to load AI models')
    }
  }

  const updateModelOptions = (provider: string) => {
    const providerModels = models.filter(model => 
      model.provider.toLowerCase() === provider.toLowerCase()
    )
    
    if (providerModels.length > 0) {
      setFormData(prev => ({
        ...prev,
        modelProvider: provider,
        modelName: providerModels[0].name
      }))
    }
  }

  const handleRunAnalysis = async () => {
    if (selectedAgents.length === 0) {
      toast.error('Please select at least one AI agent')
      return
    }

    if (!formData.tickers.trim()) {
      toast.error('Please enter at least one stock ticker')
      return
    }

    if (parseFloat(formData.initialCash) < 1000) {
      toast.error('Initial cash must be at least $1,000')
      return
    }

    setIsRunning(true)
    setShowProgress(true)
    setShowResults(false)
    setProgressUpdates([])
    setResults(null)

    try {
      const config = {
        tickers: formData.tickers.split(',').map(t => t.trim()).filter(t => t),
        selected_agents: selectedAgents,
        agent_models: selectedAgents.map(agentId => ({
          agent_id: agentId,
          model_name: formData.modelName,
          model_provider: formData.modelProvider
        })),
        start_date: formData.startDate,
        end_date: formData.endDate,
        model_name: formData.modelName,
        model_provider: formData.modelProvider,
        initial_cash: parseFloat(formData.initialCash),
        margin_requirement: 0.0
      }

      const analysisGenerator = apiService.aiHedgeFund.runAnalysis(config)
      
      for await (const event of analysisGenerator) {
        if (event.type === 'progress') {
          setProgressUpdates(prev => [...prev, event])
        } else if (event.type === 'complete') {
          setResults(event.data)
          setShowResults(true)
          toast.success('Analysis completed successfully!')
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Analysis failed: ' + (error as Error).message)
    } finally {
      setIsRunning(false)
    }
  }

  const handleStopAnalysis = () => {
    setIsRunning(false)
    setShowProgress(false)
    toast.info('Analysis stopped')
  }

  const handleAgentToggle = (agentKey: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentKey)
        ? prev.filter(key => key !== agentKey)
        : [...prev, agentKey]
    )
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action?.toLowerCase()) {
      case 'buy': return 'success'
      case 'sell': return 'danger'
      case 'hold': return 'warning'
      default: return 'default'
    }
  }

  const getSignalBadgeVariant = (signal: string) => {
    switch (signal?.toLowerCase()) {
      case 'bullish': return 'success'
      case 'bearish': return 'danger'
      case 'neutral': return 'warning'
      default: return 'default'
    }
  }

  const providerOptions = [...new Set(models.map(m => m.provider))].map(provider => ({
    value: provider,
    label: provider
  }))

  const modelOptions = models
    .filter(m => m.provider === formData.modelProvider)
    .map(model => ({
      value: model.name,
      label: model.display_name || model.name
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CpuChipIcon className="h-8 w-8 mr-3 text-primary-600" />
          AI Support & Hedge Fund
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Analiză AI avansată pentru investiții și suport
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Configurație</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Stock Tickers"
                    placeholder="AAPL,GOOGL,MSFT,TSLA"
                    value={formData.tickers}
                    onChange={(e) => setFormData(prev => ({ ...prev, tickers: e.target.value }))}
                    helperText="Lista separată prin virgulă"
                  />
                  <Input
                    label="Initial Cash ($)"
                    type="number"
                    value={formData.initialCash}
                    onChange={(e) => setFormData(prev => ({ ...prev, initialCash: e.target.value }))}
                    min="1000"
                    step="1000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="AI Model Provider"
                    options={providerOptions}
                    value={formData.modelProvider}
                    onChange={(e) => updateModelOptions(e.target.value)}
                  />
                  <Select
                    label="Model Name"
                    options={modelOptions}
                    value={formData.modelName}
                    onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                  />
                </div>

                {/* AI Agents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    AI Agents
                  </label>
                  <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <div key={agent.key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={agent.key}
                            checked={selectedAgents.includes(agent.key)}
                            onChange={() => handleAgentToggle(agent.key)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={agent.key} className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {agent.display_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {agent.description}
                            </div>
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <LoadingSpinner size="sm" className="mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Loading agents...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleRunAnalysis}
                    disabled={isRunning}
                    loading={isRunning}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleStopAnalysis}
                    disabled={!isRunning}
                  >
                    <StopIcon className="h-4 w-4 mr-2" />
                    Stop Analysis
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status Panel */}
        <div>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
            </CardHeader>
            <CardBody>
              <div className="text-center">
                {isRunning ? (
                  <div className="space-y-3">
                    <LoadingSpinner size="lg" className="mx-auto" />
                    <p className="text-sm text-gray-600">Analiză în curs...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-12 w-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <CpuChipIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Gata pentru analiză</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Progress Panel */}
      {showProgress && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Progres Analiză</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {progressUpdates.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-900">{update.agent}</div>
                    <div className="text-sm text-blue-700">{update.ticker}: {update.status}</div>
                    {update.analysis && (
                      <div className="text-xs text-blue-600 mt-1">{update.analysis}</div>
                    )}
                  </div>
                  <div className="text-xs text-blue-600">
                    {update.timestamp && new Date(update.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {progressUpdates.length === 0 && isRunning && (
                <div className="text-center py-4">
                  <LoadingSpinner size="sm" className="mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Waiting for updates...</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Results Panel */}
      {showResults && results && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Rezultate Analiză</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Decizii de Investiție</h4>
                <div className="space-y-3">
                  {Object.entries(results.decisions).map(([ticker, decision]) => (
                    <div key={ticker} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{ticker}</span>
                        <Badge variant={getActionBadgeVariant(decision.action)}>
                          {decision.action}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Cantitate: {decision.quantity || 0} acțiuni
                      </div>
                      {decision.reasoning && (
                        <div className="text-xs text-gray-500 mt-1">
                          {decision.reasoning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Semnale Analiști</h4>
                <div className="space-y-3">
                  {Object.entries(results.analyst_signals).map(([agent, signals]) => (
                    <div key={agent} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">{agent}</div>
                      <div className="space-y-1">
                        {Object.entries(signals).map(([ticker, signal]) => (
                          <div key={ticker} className="flex items-center justify-between text-sm">
                            <span>{ticker}:</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSignalBadgeVariant(signal.signal)}>
                                {signal.signal}
                              </Badge>
                              {signal.confidence && (
                                <span className="text-xs text-gray-500">
                                  {signal.confidence}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}