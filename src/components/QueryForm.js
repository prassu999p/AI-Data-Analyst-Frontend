import React, { useState } from 'react';
import { fetchQueryResults } from '../services/api';

const QueryForm = () => {
  const [query, setQuery] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchQueryResults(query, selectedChartType);
      setResults(data);
    } catch (error) {
      setError('Failed to fetch data from API');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

};

export default QueryForm; 