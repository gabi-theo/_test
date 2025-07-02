import { AI_HEDGE_FUND_URL } from '/js/constants.js';

console.log('AI Hedge Fund URL:', AI_HEDGE_FUND_URL);

class AIHedgeFund {
    constructor() {
        this.eventSource = null;
        this.isRunning = false;
        this.agents = [];
        this.models = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setDefaultDates();

        // Initialize with fallback models first
        this.initializeFallbackModels();
        this.updateModelOptions();

        // Then try to load real data from backend
        await this.loadAgents();
        await this.loadModels();
        // Update again with real models if available
        this.updateModelOptions();
    }

    initializeFallbackModels() {
        // Set fallback models immediately so the dropdown is never empty (matching backend)
        this.models = [
            { name: 'gpt-4o', provider: 'OpenAI', display_name: 'GPT 4o' },
            { name: 'claude-3-5-haiku-latest', provider: 'Anthropic', display_name: 'Claude Haiku 3.5' },
            { name: 'claude-sonnet-4-20250514', provider: 'Anthropic', display_name: 'Claude Sonnet 4' },
            { name: 'deepseek-reasoner', provider: 'DeepSeek', display_name: 'DeepSeek R1' },
            { name: 'deepseek-chat', provider: 'DeepSeek', display_name: 'DeepSeek V3' },
            { name: 'gemini-2.5-flash-preview-05-20', provider: 'Gemini', display_name: 'Gemini 2.5 Flash' },
            { name: 'meta-llama/llama-4-scout-17b-16e-instruct', provider: 'Groq', display_name: 'Llama 4 Scout (17b)' },
            { name: 'meta-llama/llama-4-maverick-17b-128e-instruct', provider: 'Groq', display_name: 'Llama 4 Maverick (17b)' }
        ];
    }

    setupEventListeners() {
        const form = document.getElementById('hedgeFundForm');
        const stopBtn = document.getElementById('stopAnalysisBtn');
        const modelProvider = document.getElementById('modelProvider');

        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopAnalysis());
        if (modelProvider) modelProvider.addEventListener('change', () => this.updateModelOptions());
    }

    setDefaultDates() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90); // 90 days ago

        const endDateInput = document.getElementById('endDate');
        const startDateInput = document.getElementById('startDate');

        if (endDateInput) endDateInput.value = endDate.toISOString().split('T')[0];
        if (startDateInput) startDateInput.value = startDate.toISOString().split('T')[0];
    }

    async loadAgents() {
        const container = document.getElementById('agentsContainer');
        if (!container) {
            console.error('agentsContainer not found');
            return;
        }

        try {
            console.log('Attempting to load agents from:', `${AI_HEDGE_FUND_URL}/hedge-fund/agents`);

            const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/agents`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Agents data received:', data);
            console.log('Individual agents:', data.agents);

            this.agents = data.agents || [];
            this.renderAgents();
        } catch (error) {
            console.error('Failed to load agents:', error);
            this.agents = []; // Ensure agents array is empty for fallback
            this.renderAgents(); // This will show the fallback demo agents
        }
    }

    async loadModels() {
        try {
            const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/language-models`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Models loaded from backend:', data);

            // Transform the backend response to match our internal format
            this.models = (data.models || []).map(model => ({
                name: model.model_name,
                provider: model.provider,
                display_name: model.display_name
            }));

            console.log('Transformed models:', this.models);
            this.updateModelOptions();
        } catch (error) {
            console.error('Failed to load models from backend:', error);
            console.log('Using fallback models that match backend configuration...');

            // Use fallback models that match the actual backend models
            this.models = [
                { name: 'gpt-4o', provider: 'OpenAI', display_name: 'GPT 4o' },
                { name: 'claude-3-5-haiku-latest', provider: 'Anthropic', display_name: 'Claude Haiku 3.5' },
                { name: 'claude-sonnet-4-20250514', provider: 'Anthropic', display_name: 'Claude Sonnet 4' },
                { name: 'deepseek-reasoner', provider: 'DeepSeek', display_name: 'DeepSeek R1' },
                { name: 'deepseek-chat', provider: 'DeepSeek', display_name: 'DeepSeek V3' },
                { name: 'gemini-2.5-flash-preview-05-20', provider: 'Gemini', display_name: 'Gemini 2.5 Flash' },
                { name: 'meta-llama/llama-4-scout-17b-16e-instruct', provider: 'Groq', display_name: 'Llama 4 Scout (17b)' },
                { name: 'meta-llama/llama-4-maverick-17b-128e-instruct', provider: 'Groq', display_name: 'Llama 4 Maverick (17b)' }
            ];
            this.updateModelOptions();
        }
    }

    renderAgents() {
        const container = document.getElementById('agentsContainer');
        if (!container) return;

        if (this.agents.length === 0) {
            // Provide fallback agents when backend is not available
            container.innerHTML = `
                <div class="alert alert-warning mb-3">
                    <strong>Backend not connected</strong><br>
                    <small>Using demo agents. Start the AI Hedge Fund backend on port 8003 for full functionality.</small>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="technical_analyst" id="agent_technical" checked>
                    <label class="form-check-label" for="agent_technical">
                        <strong>Technical Analyst (Demo)</strong><br>
                        <small class="text-muted">Analyzes price patterns and technical indicators</small>
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="fundamental_analyst" id="agent_fundamental" checked>
                    <label class="form-check-label" for="agent_fundamental">
                        <strong>Fundamental Analyst (Demo)</strong><br>
                        <small class="text-muted">Evaluates company financials and market conditions</small>
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="sentiment_analyst" id="agent_sentiment" checked>
                    <label class="form-check-label" for="agent_sentiment">
                        <strong>Sentiment Analyst (Demo)</strong><br>
                        <small class="text-muted">Analyzes market sentiment and news</small>
                    </label>
                </div>
            `;
            return;
        }

        const agentsHtml = this.agents.map((agent, index) => {
            // Use the key field from backend, fallback to other identifiers
            const agentId = agent.key || agent.id || agent.name || `agent_${index}`;
            const agentName = agent.display_name || agent.name || `Agent ${index + 1}`;
            const agentDesc = agent.description || 'AI trading agent';

            console.log('Rendering agent:', { agentId, agentName, agentDesc, originalAgent: agent });

            return `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${agentId}"
                            id="agent_${agentId}" checked>
                    <label class="form-check-label" for="agent_${agentId}">
                        <strong>${agentName}</strong>
                        <br><small class="text-muted">${agentDesc}</small>
                    </label>
                </div>
            `;
        }).join('');

        container.innerHTML = agentsHtml;
    }

    updateModelOptions() {
        const provider = document.getElementById('modelProvider')?.value;
        const modelSelect = document.getElementById('modelName');
        if (!provider || !modelSelect) {
            console.log('updateModelOptions: Missing elements', { provider, modelSelect });
            return;
        }

        console.log('Updating models for provider:', provider);
        console.log('Available models:', this.models);

        // Filter models by provider (case-insensitive comparison)
        const providerModels = this.models.filter(model =>
            model.provider.toLowerCase() === provider.toLowerCase()
        );

        console.log('Filtered models:', providerModels);

        if (providerModels.length > 0) {
            modelSelect.innerHTML = providerModels.map((model, index) =>
                `<option value="${model.name}" ${index === 0 ? 'selected' : ''}>${model.display_name || model.name}</option>`
            ).join('');
        } else {
            // Fallback options if no models found for provider (matching backend configuration)
            const fallbackModels = {
                'OpenAI': [
                    { name: 'gpt-4o', display_name: 'GPT 4o' },
                    { name: 'gpt-4.5-preview', display_name: 'GPT 4.5' },
                    { name: 'o3', display_name: 'o3' },
                    { name: 'o4-mini', display_name: 'o4 Mini' }
                ],
                'Anthropic': [
                    { name: 'claude-3-5-haiku-latest', display_name: 'Claude Haiku 3.5' },
                    { name: 'claude-sonnet-4-20250514', display_name: 'Claude Sonnet 4' },
                    { name: 'claude-opus-4-20250514', display_name: 'Claude Opus 4' }
                ],
                'DeepSeek': [
                    { name: 'deepseek-reasoner', display_name: 'DeepSeek R1' },
                    { name: 'deepseek-chat', display_name: 'DeepSeek V3' }
                ],
                'Gemini': [
                    { name: 'gemini-2.5-flash-preview-05-20', display_name: 'Gemini 2.5 Flash' },
                    { name: 'gemini-2.5-pro-preview-06-05', display_name: 'Gemini 2.5 Pro' }
                ],
                'Groq': [
                    { name: 'meta-llama/llama-4-scout-17b-16e-instruct', display_name: 'Llama 4 Scout (17b)' },
                    { name: 'meta-llama/llama-4-maverick-17b-128e-instruct', display_name: 'Llama 4 Maverick (17b)' }
                ]
            };

            const models = fallbackModels[provider] || fallbackModels['OpenAI'];
            modelSelect.innerHTML = models.map((model, index) =>
                `<option value="${model.name}" ${index === 0 ? 'selected' : ''}>${model.display_name}</option>`
            ).join('');

            console.log('Used fallback models for', provider);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isRunning) {
            this.showError('Analysis is already running');
            return;
        }

        const formData = this.getFormData();
        if (!this.validateFormData(formData)) {
            return;
        }

        this.startAnalysis(formData);
    }

    getFormData() {
        const selectedAgents = Array.from(
            document.querySelectorAll('#agentsContainer input[type="checkbox"]:checked')
        ).map(cb => cb.value).filter(value => value && value !== 'undefined');

        const tickersInput = document.getElementById('tickers');
        const initialCashInput = document.getElementById('initialCash');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const modelNameInput = document.getElementById('modelName');
        const modelProviderInput = document.getElementById('modelProvider');

        const modelName = (modelNameInput && modelNameInput.value && modelNameInput.value !== 'undefined') ? modelNameInput.value : 'gpt-4o';
        const modelProvider = (modelProviderInput && modelProviderInput.value && modelProviderInput.value !== 'undefined') ? modelProviderInput.value : 'OpenAI';

        console.log('Model selection:', { modelName, modelProvider, modelNameInput: modelNameInput?.value, modelProviderInput: modelProviderInput?.value });

        // Create agent_models array - each selected agent uses the global model settings
        const agentModels = selectedAgents.map(agentId => ({
            agent_id: agentId,
            model_name: modelName,
            model_provider: modelProvider
        }));

        const formData = {
            tickers: tickersInput ? tickersInput.value.split(',').map(t => t.trim()).filter(t => t) : [],
            selected_agents: selectedAgents,
            agent_models: agentModels,
            start_date: startDateInput ? startDateInput.value : '',
            end_date: endDateInput ? endDateInput.value : '',
            model_name: modelName,
            model_provider: modelProvider,
            initial_cash: initialCashInput ? parseFloat(initialCashInput.value) : 100000.0,
            margin_requirement: 0.0
        };

        // Remove empty fields to avoid validation issues
        if (!formData.start_date) delete formData.start_date;
        if (!formData.end_date) delete formData.end_date;
        if (formData.agent_models.length === 0) delete formData.agent_models;

        return formData;
    }

    validateFormData(data) {
        if (data.tickers.length === 0 || data.tickers[0] === '') {
            this.showError('Please enter at least one stock ticker');
            return false;
        }

        if (data.selected_agents.length === 0) {
            this.showError('Please select at least one AI agent');
            return false;
        }

        if (data.initial_cash < 1000) {
            this.showError('Initial cash must be at least $1,000');
            return false;
        }

        return true;
    }

    async startAnalysis(formData) {
        this.isRunning = true;
        this.updateUI(true);
        this.clearResults();
        this.showProgress();

        // Debug: Log the form data being sent
        console.log('Sending form data:', JSON.stringify(formData, null, 2));

        try {
            const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.log('Error response:', errorData);
                    errorMessage += ` - ${errorData.detail || errorData.message || 'Unknown error'}`;
                } catch (e) {
                    console.log('Could not parse error response');
                }
                throw new Error(errorMessage);
            }

            this.setupEventStream(response);
        } catch (error) {
            console.error('Failed to start analysis:', error);
            this.showError('Failed to start analysis: ' + error.message);
            this.stopAnalysis();
        }
    }

    setupEventStream(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readStream = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                this.handleStreamEvent(data);
                            } catch (e) {
                                console.error('Failed to parse event data:', e);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Stream reading error:', error);
                this.showError('Connection lost during analysis');
            } finally {
                this.stopAnalysis();
            }
        };

        readStream();
    }

    handleStreamEvent(event) {
        switch (event.type) {
            case 'start':
                this.updateStatus('Analysis started', 'info');
                break;
            case 'progress':
                this.addProgressUpdate(event);
                break;
            case 'complete':
                this.showResults(event.data);
                this.updateStatus('Analysis completed successfully', 'success');
                break;
            case 'error':
                this.showError(event.message);
                break;
        }
    }

    addProgressUpdate(event) {
        const container = document.getElementById('progressContainer');
        if (!container) return;

        const timestamp = new Date(event.timestamp).toLocaleTimeString();

        const progressHtml = `
            <div class="progress-item mb-2 p-2 border-start border-3 border-primary">
                <div class="d-flex justify-content-between">
                    <strong>${event.agent}</strong>
                    <small class="text-muted">${timestamp}</small>
                </div>
                <div class="text-muted">${event.ticker}: ${event.status}</div>
                ${event.analysis ? `<div class="mt-1"><small>${event.analysis}</small></div>` : ''}
            </div>
        `;

        container.insertAdjacentHTML('beforeend', progressHtml);
        container.scrollTop = container.scrollHeight;
    }

    showResults(data) {
        const resultsPanel = document.getElementById('resultsPanel');
        if (resultsPanel) resultsPanel.style.display = 'block';

        // Display decisions
        const decisionsContainer = document.getElementById('decisionsContainer');
        if (decisionsContainer) {
            decisionsContainer.innerHTML = this.formatDecisions(data.decisions);
        }

        // Display signals
        const signalsContainer = document.getElementById('signalsContainer');
        if (signalsContainer) {
            signalsContainer.innerHTML = this.formatSignals(data.analyst_signals);
        }
    }

    formatDecisions(decisions) {
        if (!decisions || Object.keys(decisions).length === 0) {
            return '<div class="text-muted">No investment decisions available</div>';
        }

        // Handle error responses from backend
        if (decisions.error) {
            return `
                <div class="alert alert-warning">
                    <strong>Analysis Error:</strong> ${decisions.error}<br>
                    ${decisions.raw_response ? `<small>Raw response: ${decisions.raw_response}</small>` : ''}
                </div>
                ${decisions.fallback_decisions ? this.formatDecisions(decisions.fallback_decisions) : ''}
            `;
        }

        return Object.entries(decisions).map(([ticker, decision]) => `
            <div class="decision-item mb-3 p-3 border rounded">
                <h6 class="text-primary">${ticker}</h6>
                <div class="row">
                    <div class="col-6">
                        <strong>Action:</strong>
                        <span class="badge ${this.getActionBadgeClass(decision.action)}">${decision.action}</span>
                    </div>
                    <div class="col-6">
                        <strong>Quantity:</strong> ${decision.quantity || 'N/A'}
                    </div>
                </div>
                ${decision.reasoning ? `<div class="mt-2"><small>${decision.reasoning}</small></div>` : ''}
            </div>
        `).join('');
    }

    formatSignals(signals) {
        if (!signals || Object.keys(signals).length === 0) {
            return '<div class="text-muted">No analyst signals available</div>';
        }

        return Object.entries(signals).map(([agent, agentSignals]) => `
            <div class="signal-item mb-3 p-3 border rounded">
                <h6 class="text-info">${agent}</h6>
                ${Object.entries(agentSignals).map(([ticker, signal]) => `
                    <div class="mb-2">
                        <strong>${ticker}:</strong>
                        <span class="badge ${this.getSignalBadgeClass(signal.signal)}">${signal.signal}</span>
                        ${signal.confidence ? `<small class="text-muted">(${signal.confidence}% confidence)</small>` : ''}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getActionBadgeClass(action) {
        switch (action?.toLowerCase()) {
            case 'buy': return 'bg-success';
            case 'sell': return 'bg-danger';
            case 'hold': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    getSignalBadgeClass(signal) {
        switch (signal?.toLowerCase()) {
            case 'bullish': return 'bg-success';
            case 'bearish': return 'bg-danger';
            case 'neutral': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    stopAnalysis() {
        this.isRunning = false;
        this.updateUI(false);

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    updateUI(running) {
        const runBtn = document.getElementById('runAnalysisBtn');
        const stopBtn = document.getElementById('stopAnalysisBtn');

        if (runBtn) {
            runBtn.disabled = running;
            runBtn.innerHTML = running ?
                '<span class="spinner-border spinner-border-sm me-2"></span>Running...' :
                '<i class="fas fa-play me-2"></i>Run Analysis';
        }

        if (stopBtn) {
            stopBtn.disabled = !running;
        }
    }

    showProgress() {
        const progressPanel = document.getElementById('progressPanel');
        const progressContainer = document.getElementById('progressContainer');

        if (progressPanel) progressPanel.style.display = 'block';
        if (progressContainer) progressContainer.innerHTML = '';
    }

    clearResults() {
        const resultsPanel = document.getElementById('resultsPanel');
        const decisionsContainer = document.getElementById('decisionsContainer');
        const signalsContainer = document.getElementById('signalsContainer');

        if (resultsPanel) resultsPanel.style.display = 'none';
        if (decisionsContainer) decisionsContainer.innerHTML = '';
        if (signalsContainer) signalsContainer.innerHTML = '';
    }

    updateStatus(message, type = 'info') {
        const container = document.getElementById('statusContainer');
        if (!container) return;

        const iconClass = type === 'success' ? 'fa-check-circle' :
                            type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        const textClass = type === 'success' ? 'text-success' :
                            type === 'error' ? 'text-danger' : 'text-info';

        container.innerHTML = `
            <div class="text-center ${textClass}">
                <i class="fas ${iconClass} fa-2x mb-2"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showError(message) {
        this.updateStatus(message, 'error');
        console.error('AI Hedge Fund Error:', message);
    }
}


let aiInstance = null;
function maybeInitAIHedgeFund() {
    if (!aiInstance) {
        aiInstance = new AIHedgeFund();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    maybeInitAIHedgeFund();
});

document.getElementById("hedge-fund-tab")?.addEventListener("shown.bs.tab", () => {
    maybeInitAIHedgeFund();
});

maybeInitAIHedgeFund();

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     // Only initialize if we're on the hedge fund tab
//     console.log("Creating AIHedgeFund instance")
//     const hedgeFundTab = document.getElementById('hedge-fund');
//     console.log(hedgeFundTab)
//     if (hedgeFundTab && hedgeFundTab.classList.contains('active')) {
//         console.log("ENTERED")
//         new AIHedgeFund();
//     }
// });

// // Initialize when hedge fund tab is shown
// const hedgeFundTabButton = document.getElementById('hedge-fund-tab');
// if (hedgeFundTabButton) {
//     hedgeFundTabButton.addEventListener('shown.bs.tab', () => {
//         new AIHedgeFund();
//     });
// }
