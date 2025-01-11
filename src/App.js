import React, { useState, useCallback, useEffect } from 'react';
import { sendQuery } from './services/api';
import ReactECharts from 'echarts-for-react';
import './App.css';
import { useTheme } from './context/ThemeContext';

// Add API base URL configuration
const API_BASE_URL = 'http://localhost:8000';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      style={{
        backgroundColor: theme.buttonBackground,
        color: theme.buttonText
      }}
    >
      {theme.backgroundColor === '#ffffff' ? '🌙' : '☀️'}
    </button>
  );
}

const COLOR_PALETTES = {
  'Vibrant': ['#ff7875', '#ff9c6e', '#ffc069', '#ffd666', '#fff566', '#bae637', '#5cdbd3', '#69c0ff', '#85a5ff'],
  'Cool': ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500', '#126782', '#4895ef', '#457b9d', '#1a759f'],
  'Warm': ['#cb997e', '#ddbea9', '#ffe8d6', '#b7b7a4', '#a5a58d', '#6b705c', '#e07a5f', '#f2cc8f', '#81b29a'],
  'Pastel': ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#fffffc']
};

function App() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [colorPalette, setColorPalette] = useState('Vibrant');

  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
  }, [theme]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendQuery({ 
        text: query, 
        chart_type: chartType === 'auto' ? null : chartType 
      });
      
      if (!response || !response.llm_analysis || !response.llm_analysis.final_answer) {
        throw new Error('Invalid response format from server');
      }

      setChartData(response.data.data.chart_data);
      setAnalysis({
        answer: response.data.data.answer,
        suggestedChart: response.data.data.suggested_chart
      });
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while processing your request. Please try again.');
      setChartData(null);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const getChartOptions = useCallback(() => {
    if (!chartData || !chartData.series || !chartData.series.length) {
      return {
        backgroundColor: 'transparent',
        textStyle: { color: theme.textColor }
      };
    }

    const baseOptions = {
      backgroundColor: 'transparent',
      textStyle: {
        color: theme.textColor
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.buttonBackground,
        borderColor: theme.borderColor,
        textStyle: {
          color: theme.textColor
        }
      },
      legend: {
        textStyle: {
          color: theme.textColor
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };

    const chartType = chartData.series[0]?.type || 'bar';

    // Handle different chart types
    switch (chartType) {
      case "line":
      case "bar":
        return {
          ...baseOptions,
          xAxis: {
            ...(chartData.xAxis || {}),
            type: 'category',
            axisLine: {
              lineStyle: {
                color: theme.textColor
              }
            },
            axisLabel: {
              color: theme.textColor
            },
            splitLine: {
              lineStyle: {
                color: theme.borderColor
              }
            }
          },
          yAxis: {
            ...(chartData.yAxis || {}),
            type: 'value',
            axisLine: {
              lineStyle: {
                color: theme.textColor
              }
            },
            axisLabel: {
              color: theme.textColor
            },
            splitLine: {
              lineStyle: {
                color: theme.borderColor
              }
            }
          },
          series: chartData.series.map((s, index) => ({
            ...s,
            type: s.type || chartType,
            itemStyle: {
              color: COLOR_PALETTES[colorPalette][index % COLOR_PALETTES[colorPalette].length]
            },
            ...(s.type === 'line' && {
              lineStyle: {
                width: 3,
                color: COLOR_PALETTES[colorPalette][index % COLOR_PALETTES[colorPalette].length]
              },
              symbol: 'circle',
              symbolSize: 8
            })
          }))
        };

      case "pie":
        return {
          ...baseOptions,
          series: [{
            ...(chartData.series[0] || {}),
            type: 'pie',
            radius: ['40%', '70%'],
            label: {
              color: theme.textColor,
              fontSize: 14
            },
            itemStyle: {
              borderRadius: 4,
              borderColor: theme.backgroundColor,
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };

      default:
        return {
          ...baseOptions,
          ...chartData
        };
    }
  }, [chartData, colorPalette, theme]);

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-container">
          <span className="logo-text">DataViz AI</span>
        </div>
        <nav>
          <a href="#docs">Docs</a>
          <a href="#tutorial">Tutorial</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <ThemeToggleButton />
          <button className="sign-in">Sign in</button>
          <button className="sign-up">Sign up</button>
        </nav>
      </div>

      <main className="main-content">
        <div className="hero">
          <h1>Transform Data into Insights</h1>
          <p>Your AI-powered data visualization companion</p>
        </div>

        <div className="query-container">
          <form onSubmit={handleSubmit} className="query-box">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask DataViz AI to visualize your data trends..."
              className="query-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="query-buttons">
              <button type="button" className="database-btn">+ Database</button>
              <button type="submit" className="submit-btn">→</button>
            </div>
          </form>

          <div className="controls-container">
            <div className="visualization-controls">
              <div className="control-group">
                <label>Chart Type:</label>
                <div className="chart-types">
                  <select 
                    value={chartType} 
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="scatter">Scatter Plot</option>
                  </select>
                </div>
              </div>

              <div className="control-group">
                <label>Color Theme:</label>
                <div className="palette-options">
                  <select 
                    value={colorPalette} 
                    onChange={(e) => setColorPalette(e.target.value)}
                  >
                    {Object.keys(COLOR_PALETTES).map(palette => (
                      <option key={palette} value={palette}>{palette}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Processing your request...</p>
            </div>
          )}

          {chartData && (
            <div className="results-container">
              <div className="chart-container">
                <ReactECharts
                  option={getChartOptions()}
                  style={{ height: '500px', width: '100%' }}
                  theme={theme.backgroundColor === '#ffffff' ? 'light' : 'dark'}
                />
              </div>

              {analysis && (
                <div className="analysis-container">
                  <h3>Analysis</h3>
                  <div className="analysis-content">
                    <p>{analysis.answer}</p>
                    {analysis.suggestedChart && (
                      <div className="suggested-chart">
                        Suggested Chart: {analysis.suggestedChart}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
