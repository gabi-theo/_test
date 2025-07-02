import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { CpuChipIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline'

export function AISupportPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleRunAnalysis = () => {
    setIsRunning(true)
    setShowProgress(true)
    setShowResults(false)
    
    // Simulate analysis
    setTimeout(() => {
      setIsRunning(false)
      setShowResults(true)
    }, 3000)
  }

  const handleStopAnalysis = () => {
    setIsRunning(false)
    setShowProgress(false)
  }

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
                    defaultValue="AAPL,GOOGL,MSFT,TSLA"
                    helperText="Lista separată prin virgulă"
                  />
                  <Input
                    label="Initial Cash ($)"
                    type="number"
                    defaultValue="100000"
                    min="1000"
                    step="1000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                  />
                  <Input
                    label="End Date"
                    type="date"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="AI Model Provider"
                    options={[
                      { value: 'OpenAI', label: 'OpenAI' },
                      { value: 'Anthropic', label: 'Anthropic' },
                      { value: 'Groq', label: 'Groq' },
                    ]}
                    defaultValue="OpenAI"
                  />
                  <Select
                    label="Model Name"
                    options={[
                      { value: 'gpt-4o', label: 'GPT-4o' },
                      { value: 'gpt-4', label: 'GPT-4' },
                      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                    ]}
                    defaultValue="gpt-4o"
                  />
                </div>

                {/* AI Agents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    AI Agents
                  </label>
                  <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="technical_analyst"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="technical_analyst" className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Technical Analyst
                        </div>
                        <div className="text-sm text-gray-500">
                          Analizează pattern-urile de preț și indicatorii tehnici
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fundamental_analyst"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="fundamental_analyst" className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Fundamental Analyst
                        </div>
                        <div className="text-sm text-gray-500">
                          Evaluează situația financiară și condițiile de piață
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sentiment_analyst"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sentiment_analyst" className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Sentiment Analyst
                        </div>
                        <div className="text-sm text-gray-500">
                          Analizează sentimentul pieței și știrile
                        </div>
                      </label>
                    </div>
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
                    <div className="loading-spinner mx-auto"></div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Technical Analyst</div>
                  <div className="text-sm text-blue-700">AAPL: Analizează indicatorii tehnici</div>
                </div>
                <div className="text-xs text-blue-600">12:34:56</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-900">Fundamental Analyst</div>
                  <div className="text-sm text-green-700">GOOGL: Evaluează rapoartele financiare</div>
                </div>
                <div className="text-xs text-green-600">12:35:12</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Results Panel */}
      {showResults && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Rezultate Analiză</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Decizii de Investiție</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">AAPL</span>
                      <Badge variant="success">BUY</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cantitate: 50 acțiuni
                    </div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">GOOGL</span>
                      <Badge variant="warning">HOLD</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cantitate: 0 acțiuni
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Semnale Analiști</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="font-medium text-blue-900 mb-2">Technical Analyst</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>AAPL:</span>
                        <Badge variant="success">BULLISH</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>GOOGL:</span>
                        <Badge variant="warning">NEUTRAL</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}