import React, { useState } from 'react';
import { sendQuery } from '../services/api';

const QueryForm = ({ onQueryResults, chartType }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sampleQueries = [
    "What is the total sales amount for each month in 2024?",
    "What is the total quantity sold for each product name?",
    "Identify the top 5 customers by total sales amount.",
    "What percentage of total sales comes from each category?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendQuery({
        text: query,
        chart_type: chartType === 'auto' ? null : chartType
      });
      
      onQueryResults(response.data);
    } catch (error) {
      setError('Failed to fetch data from API');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="query-form">
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data..."
            className="query-input"
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Loading...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="sample-queries">
        <h4>Try these sample queries:</h4>
        <div className="query-chips">
          {sampleQueries.map((sampleQuery, index) => (
            <button
              key={index}
              className="query-chip"
              onClick={() => handleSampleQuery(sampleQuery)}
            >
              {sampleQuery}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryForm; 