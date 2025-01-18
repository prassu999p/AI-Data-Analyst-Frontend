import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatabaseConnectionPage from './components/DatabaseConnectionPage';
import DatabaseSelector from './components/DatabaseSelector';
import ChartDisplay from './components/ChartDisplay';
import { sendQuery } from './services/api';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [query, setQuery] = useState('');
    const [chartType, setChartType] = useState('auto');
    const [colorPalette, setColorPalette] = useState('warm');
    const [isLoading, setIsLoading] = useState(false);
    const [queryResult, setQueryResult] = useState(null);

    // Color palette configurations
    const colorPalettes = {
        warm: ['#ff4d4f', '#ff7875', '#ff9c9c', '#ffbfbf', '#ffe2e2'],
        cool: ['#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff', '#e6f7ff'],
        vibrant: ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0'],
        pastel: ['#ffb6b9', '#fae3d9', '#bbded6', '#8ac6d1', '#b8e6e1']
    };

    const handleQuerySubmit = async () => {
        if (!selectedConnection) {
            toast.warning('Please select a database connection first');
            return;
        }
        if (!query.trim()) {
            toast.warning('Please enter a query');
            return;
        }

        setIsLoading(true);
        try {
            const response = await sendQuery({
                text: query,
                connection_id: selectedConnection.id,
                chart_type: chartType === 'auto' ? null : chartType
            });

            if (response.error) {
                throw new Error(response.error);
            }

            console.log('Raw response:', response);
            
            // Extract the data from the response
            const responseData = response.data || response;
            console.log('Response data:', responseData);
            
            // If chart type is auto, use the suggested chart type
            if (chartType === 'auto' && responseData.suggested_chart) {
                setChartType(responseData.suggested_chart);
            }
            
            setQueryResult(responseData);
            toast.success('Query executed successfully');
        } catch (error) {
            console.error('Query error:', error);
            toast.error(error.message || 'Failed to execute query');
        } finally {
            setIsLoading(false);
        }
    };

    const renderQueryResults = () => {
        if (!queryResult) return null;

        console.log('Rendering results with:', queryResult);

        return (
            <div className="results-container">
                <h3>Results</h3>
                {queryResult.chart_data && (
                    <ChartDisplay 
                        data={queryResult.chart_data} 
                        chartType={chartType === 'auto' ? queryResult.suggested_chart : chartType}
                        colorPalette={colorPalettes[colorPalette]}
                    />
                )}
            </div>
        );
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'connections':
                return <DatabaseConnectionPage />;
            case 'home':
                return (
                    <div className="main-content">
                        <div className="hero">
                            <h1>Visualize Your Data</h1>
                            <p>Ask questions about your data in plain English</p>
                        </div>
                        <div className="query-container">
                            <DatabaseSelector 
                                onConnectionSelect={setSelectedConnection}
                                selectedConnectionId={selectedConnection?.id}
                            />
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="query-input"
                                    placeholder="Ask a question about your data..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button 
                                    className="submit-button"
                                    onClick={handleQuerySubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Ask'}
                                </button>
                            </div>
                            <div className="visualization-controls">
                                <div className="control-group">
                                    <label>Chart Type</label>
                                    <select 
                                        value={chartType} 
                                        onChange={(e) => setChartType(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="line">Line Chart</option>
                                        <option value="bar">Bar Chart</option>
                                        <option value="pie">Pie Chart</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>
                                <div className="control-group">
                                    <label>Color Palette</label>
                                    <select 
                                        value={colorPalette}
                                        onChange={(e) => setColorPalette(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="warm">Warm</option>
                                        <option value="cool">Cool</option>
                                        <option value="vibrant">Vibrant</option>
                                        <option value="pastel">Pastel</option>
                                    </select>
                                </div>
                            </div>
                            {renderQueryResults()}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">
                    <button onClick={() => setCurrentPage('home')} className="logo-text">
                        DataViz AI
                    </button>
                </div>
                <nav className="nav-links">
                    <button 
                        onClick={() => setCurrentPage('home')}
                        className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => setCurrentPage('connections')}
                        className={`nav-button ${currentPage === 'connections' ? 'active' : ''}`}
                    >
                        Database Connections
                    </button>
                </nav>
            </header>

            <main className="main">
                {renderPage()}
            </main>

            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default App;
