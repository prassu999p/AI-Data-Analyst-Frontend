import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DatabaseSelector from './DatabaseSelector';
import { queryService } from '../services/queryService';
import { toast } from 'react-toastify';
import ReactECharts from 'echarts-for-react';
import './HomePage.css';

const HomePage = () => {
    // We'll use the user context later for personalization and access control
    const { user } = useAuth();
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [query, setQuery] = useState('');
    const [chartType, setChartType] = useState('auto');
    const [colorPalette, setColorPalette] = useState('warm');
    const [isLoading, setIsLoading] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);

    // Color palettes
    const colors = {
        warm: ['#ff7f50', '#ff6b6b', '#ffa07a', '#fa8072', '#e9967a'],
        cool: ['#4facfe', '#00f2fe', '#0acffe', '#495aff', '#6a5acd'],
        pastel: ['#ffb3ba', '#bae1ff', '#baffc9', '#ffffba', '#ffdfba'],
        dark: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7']
    };

    // Update chart options based on type and palette
    const updateChartOptions = (chartData, type, palette) => {
        if (!chartData) return null;

        // Extract data from the API response
        let xAxisData = [];
        let seriesData = [];
        let seriesName = '';

        // Handle different data structures from the API
        if (chartData.xAxis?.data) {
            // Data is already in xAxis format
            xAxisData = chartData.xAxis.data;
            seriesData = chartData.series[0].data;
            seriesName = chartData.series[0].name || '';
        } else if (chartData.series?.[0]?.data) {
            // Data is in series format (e.g., pie chart)
            seriesData = chartData.series[0].data;
            xAxisData = seriesData.map(item => item.name);
            seriesName = chartData.series[0].name || '';
        }

        // Add common configurations
        const commonConfig = {
            color: colors[palette],
            tooltip: {
                trigger: type === 'pie' ? 'item' : 'axis',
                axisPointer: type !== 'pie' ? {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                } : undefined
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };

        // Transform data based on chart type
        switch (type) {
            case 'pie':
                return {
                    ...commonConfig,
                    series: [{
                        name: seriesName,
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 24,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: xAxisData.map((name, index) => ({
                            name,
                            value: typeof seriesData[index] === 'object' 
                                ? seriesData[index].value 
                                : seriesData[index]
                        }))
                    }]
                };

            case 'bar':
                return {
                    ...commonConfig,
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        axisLabel: { rotate: 45 }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: seriesName,
                        type: 'bar',
                        data: seriesData.map(item => 
                            typeof item === 'object' ? item.value : item
                        ),
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        },
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0]
                        }
                    }]
                };

            case 'area':
                return {
                    ...commonConfig,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: { rotate: 45 }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: seriesName,
                        type: 'line',
                        data: seriesData.map(item => 
                            typeof item === 'object' ? item.value : item
                        ),
                        areaStyle: {
                            opacity: 0.5
                        },
                        smooth: true,
                        emphasis: {
                            focus: 'series'
                        }
                    }]
                };

            case 'line':
                return {
                    ...commonConfig,
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        axisLabel: { rotate: 45 }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: seriesName,
                        type: 'line',
                        data: seriesData.map(item => 
                            typeof item === 'object' ? item.value : item
                        ),
                        smooth: true,
                        symbolSize: 8,
                        emphasis: {
                            focus: 'series'
                        }
                    }]
                };

            default:
                // If type is 'auto', use the original chart data
                return chartData;
        }
    };

    // Update chart when type or palette changes
    useEffect(() => {
        if (queryResult?.visualization_data) {
            const newOptions = updateChartOptions(
                queryResult.visualization_data,
                chartType === 'auto' ? queryResult.suggested_chart : chartType,
                colorPalette
            );
            setChartOptions(newOptions);
        }
    }, [chartType, colorPalette, queryResult]);

    const handleAsk = async () => {
        if (!selectedConnection) {
            toast.warn('Please select a database connection first');
            return;
        }

        if (!query.trim()) {
            toast.warn('Please enter a query');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await queryService.executeQuery({
                query: query.trim(),
                connection: {
                    type: selectedConnection.type,
                    host: selectedConnection.host,
                    port: selectedConnection.port,
                    database_name: selectedConnection.database_name,
                    username: selectedConnection.username,
                    password: selectedConnection.password
                },
                chart_type: chartType === 'auto' ? null : chartType,
                color_palette: colorPalette
            });

            if (error) throw error;
            
            if (data.status === 'error') {
                toast.error(data.message || 'Failed to process query');
                setQueryResult(null);
            } else {
                setQueryResult(data.data);
                if (data.data.suggested_chart && chartType === 'auto') {
                    setChartType(data.data.suggested_chart);
                }
            }
        } catch (error) {
            console.error('Query execution failed:', error);
            toast.error(error.message || 'Failed to execute query');
            setQueryResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };

    return (
        <div className="home-container">
            <h1>Visualize Your Data</h1>
            <p className="subtitle">Ask questions about your data in plain English</p>

            <div className="query-section">
                <div className="database-selection">
                    <DatabaseSelector
                        onConnectionSelect={setSelectedConnection}
                        selectedConnectionId={selectedConnection?.id}
                        connection={selectedConnection}
                    />
                </div>

                <div className="query-input-container">
                    <input
                        type="text"
                        className="query-input"
                        placeholder="Ask a question about your data..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button 
                        className={`ask-button ${isLoading ? 'loading' : ''}`}
                        onClick={handleAsk}
                        disabled={!selectedConnection || !query.trim() || isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Ask'}
                    </button>
                </div>

                <div className="visualization-options">
                    <div className="option-group">
                        <label>Chart Type</label>
                        <select 
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="auto">Auto</option>
                            <option value="bar">Bar</option>
                            <option value="line">Line</option>
                            <option value="pie">Pie</option>
                            <option value="area">Area</option>
                        </select>
                    </div>

                    <div className="option-group">
                        <label>Color Palette</label>
                        <select 
                            value={colorPalette}
                            onChange={(e) => setColorPalette(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="warm">Warm</option>
                            <option value="cool">Cool</option>
                            <option value="pastel">Pastel</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="visualization-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>Analyzing your data...</p>
                    </div>
                )}
                {queryResult && !isLoading && (
                    <div className="result-container">
                        {queryResult.answer && (
                            <div className="answer-text">
                                {queryResult.answer}
                            </div>
                        )}
                        {queryResult.sql_query && (
                            <div className="sql-query">
                                <h4>Generated SQL:</h4>
                                <pre>{queryResult.sql_query}</pre>
                            </div>
                        )}
                        {chartOptions && (
                            <div className="chart-container">
                                <ReactECharts 
                                    option={chartOptions}
                                    style={{ height: '400px', width: '100%' }}
                                    theme={colorPalette === 'dark' ? 'dark' : undefined}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage; 