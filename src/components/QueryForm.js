import React, { useState, useRef } from 'react';
import { fetchQueryResults } from '../services/api';
import SampleQueries from './SampleQueries';

const QueryForm = ({ onQueryResults, chartType }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchQueryResults(query, chartType);
      if (data?.data) {
        onQueryResults(data.data);
      }
    } catch (error) {
      setError('Failed to fetch data from API');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (selectedQuery) => {
    setQuery(selectedQuery);
  };

  return (
    <div className="query-container">
      <form ref={formRef} onSubmit={handleSubmit} className="query-form">
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about your data..."
            className="query-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()} 
            className="submit-button"
          >
            {isLoading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>
      
      <SampleQueries onQuerySelect={handleQuerySelect} />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default QueryForm; 