import React, { useState, useCallback } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState('auto');
  const [selectedPalette, setSelectedPalette] = useState('default');

  const colorPalettes = {
    default: {
      primary: '#6b9ac4',
      gradient: ['#6b9ac4', '#405f73']
    },
    vibrant: {
      primary: '#ff6f61',
      gradient: ['#ff6f61', '#ff3b3f']
    },
    pastel: {
      primary: '#a8e6cf',
      gradient: ['#a8e6cf', '#dcedc1']
    }
  };

  const chartTypes = [
    { id: 'auto', label: 'Auto-detect' },
    { id: 'line', label: 'Line Chart' },
    { id: 'bar', label: 'Bar Chart' },
    { id: 'pie', label: 'Pie Chart' },
    { id: 'scatter', label: 'Scatter Plot' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setChartData(null);
    setAnalysis(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/query`, {
        text: query,
        chart_type: selectedChartType === 'auto' ? null : selectedChartType
      });

      if (response.data.status === "success") {
        setChartData(response.data.data.chart_data);
        setAnalysis({
          answer: response.data.data.answer,
          suggestedChart: response.data.data.suggested_chart
        });
      } else {
        setError(response.data.message || "Failed to process query");
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || "An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  const getChartOptions = useCallback(() => {
    if (!chartData) return {};
    
    const currentPalette = colorPalettes[selectedPalette];
    
    // Handle card display
    if (chartData.type === "card") {
      return {
        title: {
          text: 'Data Summary',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: chartData.content,
            fontSize: 24,
            fill: currentPalette.primary,
            textAlign: 'center'
          }
        }
      };
    }

    // Common options for all charts
    const baseOptions = {
      backgroundColor: 'transparent',
      textStyle: {
        color: '#fff'
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.8)'
      },
      legend: {
        textStyle: {
          color: '#fff'
        }
      }
    };

    // Handle different chart types
    switch (chartData.series[0].type) {
      case "line":
        return {
          ...baseOptions,
          xAxis: {
            ...chartData.xAxis,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            ...chartData.yAxis,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          series: chartData.series.map(s => ({
            ...s,
            lineStyle: { width: 3, color: currentPalette.primary },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: currentPalette.gradient[0] },
                { offset: 1, color: currentPalette.gradient[1] }
              ])
            }
          }))
        };

      case "bar":
        return {
          ...baseOptions,
          xAxis: {
            ...chartData.xAxis,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            ...chartData.yAxis,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          series: chartData.series.map(s => ({
            ...s,
            itemStyle: { 
              color: currentPalette.primary,
              borderRadius: [4, 4, 0, 0]
            }
          }))
        };

      case "pie":
        return {
          ...baseOptions,
          series: [{
            ...chartData.series[0],
            radius: ['40%', '70%'],
            label: { 
              color: '#fff',
              fontSize: 14
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16
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
        return chartData;
    }
  }, [chartData, selectedPalette]);

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="DataViz AI Logo" className="logo" />
          <span className="logo-text">DataViz AI</span>
        </div>
        <nav>
          <a href="#docs">Docs</a>
          <a href="#tutorial">Tutorial</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
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
                  {chartTypes.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedChartType(id)}
                      className={`chart-type-btn ${selectedChartType === id ? 'active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label>Color Theme:</label>
                <div className="palette-options">
                  {Object.keys(colorPalettes).map((paletteName) => (
                    <button
                      key={paletteName}
                      onClick={() => setSelectedPalette(paletteName)}
                      className={`palette-btn ${selectedPalette === paletteName ? 'active' : ''}`}
                      style={{ backgroundColor: colorPalettes[paletteName].primary }}
                      title={paletteName.charAt(0).toUpperCase() + paletteName.slice(1)}
                    />
                  ))}
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
                  theme="dark"
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
};

export default App;
