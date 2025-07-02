# AI Hedge Fund Frontend Integration

This document describes the AI Hedge Fund frontend integration with the NCH application.

## Files Created/Modified

### New Files
- `frontend/views/ai_hedge_fund.html` - Main AI hedge fund interface
- `frontend/js/ai_hedge_fund.js` - JavaScript functionality for AI hedge fund
- `frontend/AI_HEDGE_FUND_README.md` - This documentation file

### Modified Files
- `frontend/js/constants.js` - Added AI_HEDGE_FUND_URL constant
- `frontend/views/ai_support.html` - Updated to include AI hedge fund tabs

## Features

### 1. Configuration Panel
- **Stock Tickers**: Enter comma-separated stock symbols (e.g., AAPL,GOOGL,MSFT,TSLA)
- **Initial Cash**: Set the starting investment amount (minimum $1,000)
- **Date Range**: Select start and end dates for analysis (defaults to last 90 days)
- **AI Model Selection**: Choose from available AI providers and models
- **Agent Selection**: Select which AI agents to use for analysis

### 2. Real-time Progress Tracking
- Live updates during analysis execution
- Progress messages from each AI agent
- Timestamp tracking for all updates
- Scrollable progress container

### 3. Results Display
- **Investment Decisions**: Shows buy/sell/hold recommendations with quantities
- **Analyst Signals**: Displays bullish/bearish/neutral signals from each agent
- **Color-coded badges**: Visual indicators for different actions and signals

### 4. Error Handling
- Connection error detection
- API error messages
- Toast notifications for user feedback
- Graceful fallbacks for missing data

## API Integration

### Endpoints Used
- `GET /hedge-fund/agents` - Fetch available AI agents
- `GET /hedge-fund/language-models` - Fetch available AI models
- `POST /hedge-fund/run` - Start hedge fund analysis (streaming response)

### Configuration
The AI hedge fund backend URL is configured in `frontend/js/constants.js`:
```javascript
export const AI_HEDGE_FUND_URL = "http://localhost:8003";
```

## Usage

1. **Access the Interface**
   - Navigate to "Suport AI" in the sidebar
   - Click on the "AI Hedge Fund" tab

2. **Configure Analysis**
   - Enter stock tickers (comma-separated)
   - Set initial cash amount
   - Select date range
   - Choose AI model and provider
   - Select desired AI agents

3. **Run Analysis**
   - Click "Run Analysis" button
   - Monitor real-time progress updates
   - View results when analysis completes

4. **Interpret Results**
   - Review investment decisions for each ticker
   - Check analyst signals and confidence levels
   - Use color-coded badges to quickly identify recommendations

## Technical Details

### Event Streaming
The application uses Server-Sent Events (SSE) to receive real-time updates from the AI hedge fund backend. The stream handles:
- Start events
- Progress updates
- Completion events
- Error events

### Data Validation
- Minimum initial cash: $1,000
- At least one stock ticker required
- At least one AI agent must be selected
- Valid date range required

### Error Recovery
- Automatic connection retry on stream errors
- User-friendly error messages
- Graceful degradation when backend is unavailable

## Dependencies

### Frontend Dependencies
- Bootstrap 5 (for UI components)
- Font Awesome (for icons)
- Modern browser with ES6 module support

### Backend Dependencies
- AI Hedge Fund backend running on port 8003
- CORS properly configured for frontend domain

## Troubleshooting

### Common Issues

1. **"Failed to load available agents" error**
   - Ensure AI hedge fund backend is running on port 8003
   - Check CORS configuration in backend
   - Verify network connectivity

2. **Analysis doesn't start**
   - Check all required fields are filled
   - Ensure at least one agent is selected
   - Verify initial cash is at least $1,000

3. **Stream connection lost**
   - Check backend logs for errors
   - Verify network stability
   - Restart analysis if needed

### Debug Mode
Open browser developer tools to see detailed error messages and network requests.

## Future Enhancements

- Save/load analysis configurations
- Historical analysis results
- Portfolio performance tracking
- Advanced charting and visualization
- Export results to PDF/Excel
- Real-time market data integration
